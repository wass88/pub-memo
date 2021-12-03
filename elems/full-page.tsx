import Head from "next/head";
import Link from "next/link";
import memos from "../lib/memos";
import { useState } from "react";

export default function FullPage({ children }) {
  const [msg, setMsg] = useState("hello");
  return (
    <div className="container">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="format-detection"
          content="telephone=no,address=no,email=no"
        />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>wassのメモ書き</title>
        <meta name="description" content="wassのメモ書き" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤣</text></svg>"
        ></link>
      </Head>

      <div className="inner">
        <main>{children}</main>
      </div>

      <style jsx>{`
        .inner {
          max-width: 640px;
          margin: 0 auto;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic Pro",
            "Yu Gothic Medium", YuGothic, "メイリオ", sans-serif;
          font-size: 16px;
          line-height: 2;
        }
        h1 {
          font-size: 200%;
        }
        h2 {
          font-size: 150;
        }
        * {
          box-sizing: border-box;
        }
        .container {
        }
      `}</style>
    </div>
  );
}
