import React, { useReducer } from "react";
import { BlogPage } from "../lib/memo-types";
import memos from "../lib/memo-data";
import { TicTacToe } from "../lib/ticktacktoe/tictactoe-view";
import { IconEmoji } from "../elems/full-page";
import { A } from "../elems/base";

const Body = () => {
  return (
    <>
      <IconEmoji emoji="⭕"></IconEmoji>
      <TicTacToe></TicTacToe>
      <h2>ルール</h2>
      <ul>
        <li>先手はマルを、後手はバツを1つずつ交互に配置する。</li>
        <li>自分の記号を3つ直線状に並べると小ゲームに勝利。</li>
        <li>勝利した小ゲームを直線状に並べると内包するゲームに勝利。</li>
        <li>直前手の配置された場所に対応する小ゲームにしか配置できない。</li>
        <ul>
          <li>
            対応する小ゲームとは、直前手の座標を1つ上にシフトした小ゲームである。
          </li>
          <li>
            例:
            直前手が「右上の左下の右下」ならば、「左下の右下」が対応する小ゲームである。
          </li>
        </ul>
        <li>ただし、どこにも配置できないときは、どこでも配置可能。</li>
        <li>Botはかなり素朴な子。</li>
        <li>
          <A href="https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E3%80%87%C3%97%E3%82%B2%E3%83%BC%E3%83%A0">
            元ネタ: スーパー〇×ゲーム Wikipedia
          </A>
        </li>
      </ul>
    </>
  );
};
const page: BlogPage = {
  id: "2021-05-27-more-ultimate-ticktacktoe",
  title: "N次元マルバツゲーム Super Ultimate TickTackToe",
  summary: "異常にネストした◯✕ゲーム",
  tags: ["game"],
  body: Body,
};
memos.add(page);
