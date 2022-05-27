import React, { useReducer } from "react";
import { BlogPage } from "../lib/memo-types";
import memos from "../lib/memo-data";
import { TicTacToe } from "../lib/ticktacktoe/tictactoe-view";

const Body = () => {
  return (
    <>
      <TicTacToe></TicTacToe>
    </>
  );
};
const page: BlogPage = {
  id: "2021-02-14-more-ultimate-ticktacktoe",
  title: "N次元マルバツゲーム Ultimate TickTackToe",
  summary: "異常にネストした◯✕ゲーム",
  tags: ["game"],
  body: Body,
};
memos.add(page);
