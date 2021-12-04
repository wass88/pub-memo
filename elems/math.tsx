import React from "react";
import KaTeX from "katex";
import "katex/dist/katex.min.css";

type MathProp = {
  children: string;
  block?: boolean;
};
const Math: React.FC<MathProp> = ({ children, block }) => {
  const html = KaTeX.renderToString(children);
  if (block) {
    return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
  }
  return <span dangerouslySetInnerHTML={{ __html: html }}></span>;
};

export default Math;
