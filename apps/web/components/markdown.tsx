'use client';

import { memo, ReactNode, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

export interface MarkdownProps {
  content: string;
}

export const Markdown = ({ content }: MarkdownProps) => {
  return (
    <div className="prose dark:prose-invert text-sm w-full max-w-none font-primary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pre({ className, children, ...props }: any) {
            return (
              <Code className={className} {...props}>
                {children}
              </Code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// eslint-disable-next-line react/display-name
const Code = memo(({ children }: { children: ReactNode }) => {
  const [copied, setCopied] = useState(false);

  const onCopyClick = () => {
    const textToCopy = children?.toString() ?? '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-end p-2 bg-accent rounded-t-lg">
        {copied ? (
          <div className="flex items-center gap-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>

            <span className="text-xs">Copied!</span>
          </div>
        ) : (
          <button onClick={onCopyClick} className="flex items-center gap-x-1 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
              />
            </svg>
            <span className="text-xs">Copy</span>
          </button>
        )}
      </div>
      <pre className="mt-0 rounded-t-none p-0 bg-accent rounded-b-lg">{children}</pre>
    </>
  );
});
