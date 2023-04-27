import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import memos from "../lib/memos";
import FullPage from "../elems/full-page";
import { MemoList } from "../elems/memo-card";
import { fetchNotionInfo } from "../lib/notion/fetch-page";

export async function getStaticProps() {
  return {
    props: {
      notion: await fetchNotionInfo(),
    },
  };
}

export default function Home({ notion }) {
  memos.addNotion(notion);
  return (
    <FullPage>
      <Head>
        <meta name="description" content="メモ書きたち" />
        <title>wassのメモ書き</title>
      </Head>

      <a href="https://wass80.xyz">
        <h1>メモ書き</h1>
        <style jsx>{`
          h1 {
            margin-bottom: 0.4rem;
          }
        `}</style>
      </a>
      <MemoList memos={memos.getAll()}></MemoList>
    </FullPage>
  );
}
