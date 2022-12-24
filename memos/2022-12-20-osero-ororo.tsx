import React from "react";
import { BlogPage } from "../lib/memo-types";
import memos from "../lib/memo-data";
import { Ororo } from "../lib/ororo/ororo-view";
import { IconEmoji } from "../elems/full-page";
import { A } from "../elems/base";

const Body = () => {
  return (
    <>
      <IconEmoji emoji="🏁"></IconEmoji>
      <Ororo></Ororo>
    </>
  );
};

const page: BlogPage = {
  id: "2022-12-20-osero-ororo",
  title: "オセロ？オロロ？エロセ？オセロの変わったルールを大量に生成",
  summary: "小谷善行さん発案のOSEROバリアントです。本家とは異なる実装です。",
  tags: ["game"],
  body: Body,
};
memos.add(page);
