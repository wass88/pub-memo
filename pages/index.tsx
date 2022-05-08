import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import memos from "../lib/memos";
import FullPage from "../elems/full-page";

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

      <h1>メモ書きたち</h1>
      {memos.getAll().map((memo) => {
        return (
          <Link key={memo.id} href={`/${memo.id}`} passHref>
            <div>
              <h2>
                {memo.title}
                <span>{memo.id}</span>
              </h2>
              <p>{memo.summary}</p>
              <p>{memo.tags}</p>
            </div>
          </Link>
        );
      })}
      <style jsx>{`
        h2 > span {
          font-size: 16px;
          margin-inline-start: 0.5em;
        }
      `}</style>
    </FullPage>
  );
}
