/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { theme } = useTheme();

  const components: Components = {
    // Headings
    h1({ children }) {
      return (
        <h1 className="text-4xl font-extrabold mb-5 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          {children}
        </h1>
      );
    },
    h2({ children }) {
      return (
        <h2 className="text-2xl font-bold mb-4 border-b pb-4 border-blue-500/30 text-blue-600 dark:text-blue-400">
          {children}
        </h2>
      );
    },
    h3({ children }) {
      return (
        <h3 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
          {children}
        </h3>
      );
    },

    // Paragraph
    p({ children }) {
      const hasBlockChild = React.Children.toArray(children).some(
        (c) =>
          React.isValidElement(c) &&
          ["div", "pre", "table", "blockquote"].includes(c.type as string)
      );
      if (hasBlockChild) return <>{children}</>;
      return (
        <div className="text-[16px] leading-[1.8] text-gray-700 dark:text-gray-300">
          {children}
        </div>
      );
    },

    // Lists
    ul({ children }) {
      return (
        <ul className="list-disc list-inside space-y-2 mb-6 pl-4">
          {children}
        </ul>
      );
    },
    ol({ children }) {
      return (
        <ol className="list-decimal list-inside space-y-2 mb-6 pl-4">
          {children}
        </ol>
      );
    },

    li({ children }) {
      return (
        <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {children}
        </li>
      );
    },

    // Links
    a({ href, children }) {
      return (
        <a
          href={href ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          {children}
        </a>
      );
    },

    //@ts-ignore
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");

      if (!inline) {
        return (
          <div className="my-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
            <SyntaxHighlighter
              //@ts-ignore
              style={theme === "dark" ? oneDark : oneLight}
              language={match ? match[1] : "text"}
              PreTag="div"
              customStyle={{
                margin: 0,
                padding: "1rem 1.25rem",
                background: "transparent",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                borderRadius: "0.5rem",
              }}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code className="bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-2 py-[2px] rounded font-mono text-[0.85rem]">
          {children}
        </code>
      );
    },

    // Blockquote
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-4 py-2 my-6 rounded text-gray-700 dark:text-gray-300 italic">
          {children}
        </blockquote>
      );
    },

    hr() {
      return (
        <hr className="my-4 border-t border-gray-300 dark:border-gray-700" />
      );
    },

    strong({ children }) {
      return (
        <strong className="font-semibold text-gray-900 dark:text-gray-100">
          {children}
        </strong>
      );
    },

    table({ children }) {
      return (
        <table className="border-collapse border border-gray-300 dark:border-gray-700 mb-6 w-full text-left">
          {children}
        </table>
      );
    },
    th({ children }) {
      return (
        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
          {children}
        </td>
      );
    },
  };

  return (
    <div suppressHydrationWarning={true}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
