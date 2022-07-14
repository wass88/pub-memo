import React from "react";
import KaTeX from "katex";

type MathProp = {
  children: string;
  block?: boolean;
};
const Math: React.FC<MathProp> = ({ children, block }) => {
  const html = KaTeX.renderToString(children);
  if (block) {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: html }} className="math"></div>
        <style jsx>{`
          .math {
            margin: 0 auto 1rem auto;
            text-align: center;
          }
        `}</style>
      </>
    );
  }
  return <span dangerouslySetInnerHTML={{ __html: html }}></span>;
};

export default Math;
