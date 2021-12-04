import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const Code = ({ children, lang }) => {
  return (
    <SyntaxHighlighter language={lang} style={coldarkDark}>
      {children.trim()}
    </SyntaxHighlighter>
  );
};

export default Code;
