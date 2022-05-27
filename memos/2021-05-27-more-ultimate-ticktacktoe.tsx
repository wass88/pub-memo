import React, { useReducer } from "react";
import { BlogPage } from "../lib/memo-types";
import memos from "../lib/memo-data";
import { TicTacToe } from "../lib/ticktacktoe/tictactoe-view";
import { IconEmoji } from "../elems/full-page";

const Body = () => {
  return (
    <>
      <IconEmoji emoji="⭕"></IconEmoji>
      <TicTacToe></TicTacToe>
    </>
  );
};
const page: BlogPage = {
  id: "2021-05-27-more-ultimate-ticktacktoe",
  title: "N次元マルバツゲーム Ultimate TickTackToe",
  summary: "異常にネストした◯✕ゲーム",
  tags: ["game"],
  body: Body,
};
memos.add(page);
