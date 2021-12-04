import { BlogPage } from "../lib/memo-types";
import memos from "../lib/memo-data";
import React, { useReducer } from "react";
import Code from "../elems/code";
import Math from "../elems/math";

const Body = () => {
  const [count, increment] = useReducer((x) => x + 1, 0);
  return (
    <>
      <p>
        md書かなくともいいんじゃないかということで、メモ書きにtsxを直に書こうと思う。
      </p>
      <p>コードハイライトもあるし、</p>
      <Code lang="js">{`
const x = [1, 2, 3];
x.map(a =>  a * a);
      `}</Code>
      <p>
        インタラクティブなものをかけるし、x = {count}。
        <button onClick={increment}>x++</button>
      </p>
      <p>
        KaTeXの数式もかける。<Math>{`x ^ 2 + y ^ 2 = z ^ 2`}</Math>
      </p>
      <Math block>{`
        f(\\relax{x}) = \\int_{-\\infty}^\\infty
        f(\\hat\\xi)\\,e^{2 \\pi i \\xi x}
        \\,d\\xi
      `}</Math>
    </>
  );
};
const page: BlogPage = {
  id: "2021-10-29-next-js",
  title: "メモ構築にnextjsを使う",
  tags: ["js", "nextjs"],
  body: Body,
};
memos.add(page);
