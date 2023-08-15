"use client";

import React, { useEffect } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import Prism from "prismjs";

import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-aspnet";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-json";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-r";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-go";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-mongodb";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

interface RenderMarkdownProps {
  data: string;
}

const SyntaxHighlight: Components["code"] = ({
  node,
  inline,
  className,
  ...props
}) => {
  return <code className={`${className} line-numbers`} {...props} />;
};

const RenderMarkdown: React.FC<RenderMarkdownProps> = ({ data }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <ReactMarkdown
      components={{ code: SyntaxHighlight }}
      rehypePlugins={[rehypeRaw]}
    >
      {data}
    </ReactMarkdown>
  );
};

export default RenderMarkdown;
