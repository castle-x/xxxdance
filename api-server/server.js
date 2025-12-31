const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// 启用 CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PROPFIND', 'MKCOL', 'HEAD'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Depth', 'X-WebDAV-Target', 'If-None-Match', 'If-Match'],
  credentials: false
}));

// 处理 OPTIONS 预检请求
app.options('*', (req, res) => {
  res.status(204).end();
});

// WebDAV 代理路由
app.all('/api/webdav-proxy/*', async (req, res) => {
  console.log('='.repeat(80));
  console.log('[WebDAV Proxy] Incoming request:');
  console.log('  Method:', req.method);
  console.log('  Path:', req.path);
  console.log('  Headers:', JSON.stringify({
    'x-webdav-target': req.headers['x-webdav-target'],
    'authorization': req.headers['authorization'] ? `Basic ${req.headers['authorization']?.substring(6, 20)}...` : undefined,
    'content-type': req.headers['content-type'],
    'content-length': req.headers['content-length'],
    'depth': req.headers['depth'],
  }, null, 2));

  const targetUrl = req.headers['x-webdav-target'];
  
  if (!targetUrl) {
    console.log('  ✗ Missing X-WebDAV-Target header');
    return res.status(400).json({
      error: 'Missing X-WebDAV-Target header',
      hint: 'Add X-WebDAV-Target: https://dav.jianguoyun.com to request headers'
    });
  }

  try {
    // 提取 WebDAV 路径
    const webdavPath = req.path.replace('/api/webdav-proxy', '');
    const fullUrl = new URL(targetUrl.replace(/\/$/, '') + webdavPath);
    const httpModule = fullUrl.protocol === 'https:' ? https : http;

    console.log('  Target URL:', fullUrl.toString());

    // 构建请求头
    const headers = {
      'host': fullUrl.host,
    };

    // 转发必要的请求头
    const headersToForward = ['authorization', 'content-type', 'content-length', 'depth', 'if-none-match', 'if-match'];
    for (const key of headersToForward) {
      const value = req.headers[key];
      if (value) {
        headers[key] = Array.isArray(value) ? value[0] : value;
      }
    }

    console.log('  Forwarding headers:', JSON.stringify({
      'host': headers['host'],
      'authorization': headers['authorization'] ? `Basic ${headers['authorization']?.substring(6, 20)}...` : undefined,
      'content-type': headers['content-type'],
      'content-length': headers['content-length'],
      'depth': headers['depth'],
    }, null, 2));

    // 创建代理请求
    await new Promise((resolve, reject) => {
      const proxyReq = httpModule.request(
        fullUrl,
        {
          method: req.method,
          headers,
        },
        (proxyRes) => {
          console.log('  ← Response status:', proxyRes.statusCode);
          console.log('  ← Response headers:', JSON.stringify({
            'content-type': proxyRes.headers['content-type'],
            'content-length': proxyRes.headers['content-length'],
            'etag': proxyRes.headers['etag'],
          }, null, 2));

          // 设置响应状态
          res.status(proxyRes.statusCode || 500);

          // 转发响应头
          for (const [key, value] of Object.entries(proxyRes.headers)) {
            const lowerKey = key.toLowerCase();
            if (
              lowerKey !== 'content-encoding' &&
              lowerKey !== 'transfer-encoding' &&
              lowerKey !== 'connection' &&
              value
            ) {
              res.setHeader(key, value);
            }
          }

          // 流式转发响应体
          const chunks = [];
          proxyRes.on('data', (chunk) => chunks.push(chunk));
          proxyRes.on('end', () => {
            const body = Buffer.concat(chunks);
            
            // 如果是错误状态，打印响应体内容
            if (proxyRes.statusCode && proxyRes.statusCode >= 400) {
              console.log('  ✗ Error response body:', body.toString('utf-8').substring(0, 500));
            }
            
            console.log('  ✓ Proxy completed, body size:', body.length, 'bytes');
            console.log('='.repeat(80));
            res.send(body);
            resolve();
          });
          proxyRes.on('error', reject);
        }
      );

      proxyReq.on('error', (err) => {
        console.log('  ✗ ProxyReq error:', err);
        reject(err);
      });

      // 转发请求体
      if (req.method === 'PUT' || req.method === 'POST' || req.method === 'PATCH') {
        req.pipe(proxyReq);
      } else {
        const contentLength = parseInt(req.headers['content-length'] || '0', 10);
        if (contentLength > 0) {
          req.pipe(proxyReq);
        } else {
          proxyReq.end();
        }
      }
    });
  } catch (error) {
    console.error('  ✗ WebDAV proxy exception:', error);
    console.log('='.repeat(80));
    res.status(502).json({
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown error',
      target: targetUrl
    });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'xxxdance-api-server' });
});

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'XXxDance API Server',
    endpoints: {
      proxy: '/api/webdav-proxy/*',
      health: '/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 XXxDance API Server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   WebDAV proxy: http://localhost:${PORT}/api/webdav-proxy/*`);
});

