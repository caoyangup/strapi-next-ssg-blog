import Link from "next/link";
import CodeCopyBtn from './CodeCopyBtn'
import ImageViewer from './ImageViewer'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm' // 导入 GFM 插件，用于支持表格、删除线等
import remarkAddDividerBeforeH2 from './remarkAddDividerBeforeH2' // 导入自定义插件，在 h2 前添加分隔符
import rehypeSlug from 'rehype-slug' // 导入插件，为标题添加 id
import rehypeAutolinkHeadings from 'rehype-autolink-headings' // 导入插件，为标题添加锚点链接
import rehypeRaw from 'rehype-raw' // 导入插件，用于解析和渲染 HTML
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'


const ArticleContent = ({ content }) => {
  const components = {
    // 处理链接 <a> 标签
    // 如果是外部链接，则在新标签页中打开，并添加 nofollow 和 noreferrer 属性
    a: ({ node, ...props }) => {
      const href = props.href || '';
      const isExternal = !href.startsWith('/') && !href.startsWith('#');
      return (
        <Link
          {...props}
          href={href}
          rel={isExternal ? 'nofollow noreferrer' : undefined}
          target={isExternal ? '_blank' : undefined}
          className="" // 使用 Tailwind CSS 添加样式
        />
      );
    },
    // p: ({ node, ...props }) => <p className='!break-words' {...props} />,

    // 处理图片 <img> 标签
    // 使用自定义的 ImageViewer 组件来渲染图片
    img: ({ node, ...props }) => <ImageViewer image={props} />,

    // 处理代码块 <pre> 标签
    // 在代码块右上角添加一个自定义的“复制代码”按钮 relative bg-[#282c34] rounded-md
    pre: ({ children, node }) => (
      <pre className='!p-0'>
        {/*
          从子节点中提取纯文本代码，并传递给 CodeCopyBtn 组件
          node.children[0]?.children[0]?.value 这种访问方式是为了安全地获取到 code 标签内的文本内容
        */}
        {/* {node?.children?.[0]?.children?.[0]?.value && (
          <CodeCopyBtn>{node.children[0].children[0].value}</CodeCopyBtn>
        )} */}
        {children}
      </pre>
    ),

    // 处理行内代码 <code> 和代码块
    code(props) {
      const { children, className, node, ...rest } = props
      const match = /language-(\w+)/.exec(className || '')
      console.log(node?.children?.[0]?.value);

      return match ? (
        <div className="relative">
          {node?.children?.[0]?.value && (
            <CodeCopyBtn>{node?.children?.[0]?.value}</CodeCopyBtn>
          )}
          <SyntaxHighlighter
            {...rest}
            PreTag="div"
            children={String(children).replace(/\n$/, '')}
            language={match[1]}
            className="!my-0"
            style={oneDark}
          />
        </div>

      ) : (
        <code {...rest} className={className}>
          {children}
        </code>
      )
    }

  };

  return (
    <Markdown
      // remark 插件用于处理 markdown -> mdast (语法树)
      remarkPlugins={[remarkGfm, remarkAddDividerBeforeH2]} // 启用 GFM 支持和自动添加分隔符
      // rehype 插件用于处理 mdast -> hast (HTML 语法树)
      rehypePlugins={[
        rehypeRaw, // !! 关键：用于解析 Markdown 中的 HTML 内容
        rehypeSlug, // 为 h1, h2, ... 标题添加 id
        rehypeAutolinkHeadings, // 为标题自动添加锚点链接
      ]}
      components={components} // 传入自定义的组件来渲染特定的 HTML 元素
    >
      {content}
    </Markdown>
  );
}

export default ArticleContent;