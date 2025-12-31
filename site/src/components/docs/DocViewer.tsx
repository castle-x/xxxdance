/**
 * 文档查看器组件
 * 
 * 渲染 Markdown 文档内容
 */

import { memo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface DocViewerProps {
	/** Markdown 内容 */
	content: string
	/** 额外的 className */
	className?: string
}

/**
 * 文档查看器
 * 
 * 使用 react-markdown 渲染 Markdown 内容
 * 支持 GFM（GitHub Flavored Markdown）扩展
 */
export const DocViewer = memo(function DocViewer({ content, className }: DocViewerProps) {
	return (
		<article className={cn("rich-text-content", className)}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					// 自定义图片渲染（支持视频检测）
					img: ({ src, alt, ...props }) => {
						// 检测视频文件
						if (src && /\.(mp4|webm|ogg)$/i.test(src)) {
							return (
								<video
									src={src}
									controls
									playsInline
									className="w-full rounded-lg my-4"
								>
									{alt}
								</video>
							)
						}
						// 普通图片或 GIF
						return (
							<img
								src={src}
								alt={alt}
								loading="lazy"
								className="rounded-lg my-4 max-w-full"
								{...props}
							/>
						)
					},
					// 自定义链接（新窗口打开外部链接）
					a: ({ href, children, ...props }) => {
						const isExternal = href?.startsWith("http")
						return (
							<a
								href={href}
								target={isExternal ? "_blank" : undefined}
								rel={isExternal ? "noopener noreferrer" : undefined}
								{...props}
							>
								{children}
							</a>
						)
					},
					// 自定义代码块
					code: ({ className, children, ...props }) => {
						const match = /language-(\w+)/.exec(className || "")
						const isInline = !match
						
						if (isInline) {
							return (
								<code className={className} {...props}>
									{children}
								</code>
							)
						}
						
						return (
							<div className="code-block-wrapper">
								<div className="code-block-with-lines">
									<pre>
										<code className={className} {...props}>
											{children}
										</code>
									</pre>
								</div>
							</div>
						)
					},
				}}
			>
				{content}
			</ReactMarkdown>
		</article>
	)
})

