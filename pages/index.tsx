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
  const [msg, setMsg] = useState("hello");
  return (
    <FullPage>
      <Head>
        <meta name="description" content="メモ書きたち" />
        <title>wassのメモ書き</title>
      </Head>

      <h1>メモ書きたち</h1>
      {memos.memos.map((memo) => {
        return (
          <Link key={memo.id} href={`/${memo.id}`}>
            <div>
              <h2>
                {memo.title}
                <span>{memo.id}</span>
              </h2>
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
