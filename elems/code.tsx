import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const Code = ({ children, lang }) => {
  return (
    <SyntaxHighlighter
      language={lang}
      style={coldarkDark}
      customStyle={{ margin: "0 0 1rem 0" }}
    >
      {children.trim()}
    </SyntaxHighlighter>
  );
};

export default Code;
