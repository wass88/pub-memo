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
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
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

      <style jsx global>{`
        * {
          box-sizing: border-box;
          padding: 0;
          margin: 0;
        }
        :root {
          --main-color: #369757;
          --sub-light-color: #8abd43;
          --sub-dark-color: #316d81;
          --sub-light-lightest: #e8f4d9;

          --fg-color: var(--sub-light-lightest);
          --bg-color: #202020;

          --jump: 16px;
        }
        html {
          font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic Pro",
            "Yu Gothic Medium", YuGothic, "メイリオ", sans-serif;
          font-size: var(--jump);
          line-height: 2;
          color: var(--fg-color);
          background: #111;
        }
        body {
          height: 100vh;
          background: linear-gradient(137deg, #111, #222);
        }
        h1 {
          font-size: 400%;
          line-height: 1.25;
          font-weight: bold;
          padding: calc(3 * var(--jump)) 0;
          --stripe-color: var(--sub-dark-color);
          background-color: var(--main-color);
          background-image: linear-gradient(
            90deg,
            transparent 50%,
            var(--stripe-color) 50%
          );
          background-size: 5px 10px;
          background-clip: text;
          color: transparent;
          margin-top: -8px;
          margin-bottom: -36px;
        }
        h2 {
          font-size: 150;
        }
        .inner {
          max-width: 960px;
          margin: 0 auto;
        }
        @media screen and (max-width: 960px) {
          .inner {
            padding: 0 16px;
          }
        }
        a {
          text-decoration: inherit;
        }
        a:hover {
          color: inherit;
        }
        a:visited {
          color: inherit;
        }
      `}</style>
    </div>
  );
}
