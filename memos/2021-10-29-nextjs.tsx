import { BlogPage } from "../lib/memo-types";
import memos from "../lib/memo-data";
import React from "react";

const page: BlogPage = {
  id: "2021-10-29-next-js",
  title: "メモ構築にnextjsを使う",
  body() {
    return (
      <span>
        md書かなくともいいんじゃないかということで、メモ書きにtsxを直に書こうと思う。
      </span>
    );
  },
  tags: ["js", "nextjs"],
};
memos.add(page);
