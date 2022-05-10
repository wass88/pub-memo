import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import memos from "../lib/memos";
import FullPage from "../elems/full-page";
import { MemoList } from "../elems/memo-card";

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default function Home({}) {
  return (
    <FullPage>
      <Head>
        <meta name="description" content="メモ書きたち" />
        <title>wassのメモ書き</title>
      </Head>

      <h1>メモ書き</h1>
      <MemoList memos={memos.getAll()}></MemoList>
    </FullPage>
  );
}
