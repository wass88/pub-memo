import { BlogPage } from "../lib/memo-types";
import memos from "../lib/memo-data";
import React, { useReducer } from "react";
import Code from "../elems/code";
import Math from "../elems/math";
import { Tips } from "../elems/base";

const Body = () => {
  const [count, increment] = useReducer((x) => x + 1, 0);
  return (
    <>
      <h2></h2>
      <h3></h3>
      <Tips></Tips>
    </>
  );
};
const page: BlogPage = {
  id: "2021-03-03-design-all",
  title: "ブログとして整える",
  summary: "cssでブログデザインを整える",
  tags: ["css"],
  body: Body,
};
memos.add(page);
