import { BlogPage } from "../lib/memo-types";
import memos from "../lib/memo-data";
import React, { useReducer } from "react";
import * as B from "../elems/bridge";

const Body = () => {
  return (
    <>
      <Box>
        <h2>ハンドを見て気持ちになる</h2>
        <Table>
          <Tr>
            <Td>0-5</Td>
            <Td>弱い</Td>
          </Tr>
        </Table>
        <Table>
          <Tr>
            <Td>4-3-3-3</Td>
            <Td>クソバランスハンド</Td>
          </Tr>
          <Tr>
            <Td>4-4-3-2</Td>
            <Td>バランスハンド メジャー4-4だと少しだけ嬉しい</Td>
          </Tr>
          <Tr>
            <Td> 5-3-3-2 </Td>
            <Td>メジャーが5だとスートと思う。マイナーが5だとバランスハンド</Td>
          </Tr>
          <Tr>
            <Td>6-3-2-2</Td>
            <Td>6 1スーター</Td>
          </Tr>
          <Tr>
            <Td>5-4-2-2</Td>
            <Td>5-4 2スーター</Td>
          </Tr>
          <Tr>
            <Td>4-4-4-1</Td>
            <Td>4-4-4 3スーター</Td>
          </Tr>
        </Table>
      </Box>
      <Box>
        <h2>ブリッジのスコア</h2>
        <Table>
          <Tr>
            <Td>宣言点</Td>
            <Td>20 30 30(+10)</Td>
          </Tr>
          <Tr>
            <Td>ゲーム点</Td>
          </Tr>
        </Table>
      </Box>
      <Box>
        <h2>ゲームに達する方法</h2>
        <p>25点あればゲームを目指す</p>
      </Box>
      <Box>
        <h2>ビッドの仕組み</h2>
        <p>S/O INV F1 FGの4つで強さを示す</p>
        <p>スートを言うとそのスートを持っている</p>
        <p>NTを言うとバランスハンドの気持ち</p>
      </Box>
      <Box>
        <h2>ビッドの読み方</h2>
        <p>ビッドは言語化して覚えます</p>
        <p>オープン - レスポンス; リビッド - レスポンダリビッド</p>
        <p>オープン - (オーバーコール) - レスポンス - (アドバンス)</p>
      </Box>
      <Box>
        <h2>バランスハンドのオープン</h2>
      </Box>
      <Box>
        <h2>1NT後の流れ ステイマンとトランスファー</h2>
      </Box>
      <Box>
        <h2>スートハンドのオープンと2/1原則</h2>
      </Box>
      <Box>
        <h2>マイナーオープン後 1C-? 1D-?</h2>
      </Box>
      <Box>
        <h2>メジャーオープン後 1H-? 1S-?</h2>
      </Box>
      <Box>
        <h2>介入後の原則とキュービッド</h2>
      </Box>
      <Box>
        <h2>ダブルの一覧</h2>
      </Box>
      <Box>
        <h2>オープニングリード</h2>
      </Box>
      <Box>
        <h2>シグナル</h2>
      </Box>
      <Box>
        <h2>プレイの方針</h2>
      </Box>
    </>
  );
};
const page: BlogPage = {
  id: "2022-01-07-bridge",
  title: "ブリッジのメモ書き",
  summary: "ブリッジ用の記法を整理",
  tags: ["bridge"],
  body: Body,
};
memos.add(page);
