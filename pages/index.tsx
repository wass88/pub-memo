import Head from "next/head";
import { importMemos } from "../lib/memos";
import { useState } from "react";

//export async function getStaticProps() {
//  const fileNames = await new Promise((f, t) => glob("*", (ng, ok) => f(ok)));
//  return {
//    props: {
//      memos: await importMemos(),
//    },
//  };
//}

export default function Home({ memos }) {
  const [msg, setMsg] = useState("hello");
  return (
    <div className="container">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="メモ書きたち" />
        <meta
          name="format-detection"
          content="telephone=no,address=no,email=no"
        />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Hypergelast</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤣</text></svg>"
        ></link>
      </Head>

      <main>
        <h1>メモ書きたち</h1>
        <p>{msg}</p>
        <div onClick={() => setMsg(msg + "!")}>yES!!!!</div>
      </main>

      <style jsx>{`
        main {
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
          line-height: 1.5;
        }
        h1 {
          font-size: 200%;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
