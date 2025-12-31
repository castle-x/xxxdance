# XXxDance Makefile
# 使用 bun 作为包管理器

.PHONY: help install dev-web build preview clean

# 默认目标
help:
	@echo "XXxDance 开发命令:"
	@echo ""
	@echo "  make install    - 安装依赖"
	@echo "  make dev-web    - 启动前端开发服务器"
	@echo "  make build      - 构建生产版本"
	@echo "  make preview    - 预览生产版本"
	@echo "  make clean      - 清理构建产物"
	@echo ""

# 安装依赖
install:
	cd site && bun install

# 开发模式
dev-web:
	cd site && bun run dev

# 构建
build:
	cd site && bun run build

# 预览构建产物
preview:
	cd site && bun run preview

# 清理
clean:
	rm -rf site/dist site/node_modules/.vite

