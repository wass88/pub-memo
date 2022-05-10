import Head from "next/head";
import Link from "next/link";
import FullPage from "../elems/full-page";
import memos, { getDate } from "../lib/memos";
import { MemoList } from "../elems/memo-card";

function MemoPage({ id }) {
  const memo = memos.get(id);
  return (
    <FullPage>
      <Head>
        <meta name="description" content={`${memo.title} -- ${memo.summary}`} />
        <meta name="date" content={getDate(memo)} />
        <title>{memo.title} - wassのメモ書き</title>
      </Head>
      <Link href={`.`} passHref>
        <a>
          <h1>{memo.title}</h1>
        </a>
      </Link>
      <div className="sub-info">
        <span>公開日: {getDate(memo)}</span>
      </div>
      <memo.body></memo.body>
      <aside>
        <Link href="/" passHref>
          <a>
            <h1>他の記事</h1>
          </a>
        </Link>
        <MemoList memos={memos.getAll()}></MemoList>
      </aside>
      <style jsx>{`
        .sub-info {
          margin: -36px 0 16px 0;
          font-size: 75%;
        }
        nav {
          margin-top: 32px;
        }
      `}</style>
    </FullPage>
  );
}
export default MemoPage;

export async function getStaticPaths() {
  return {
    paths: memos.getAll().map((b) => {
      return {
        params: {
          id: b.id,
        },
      };
    }),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      id: params.id,
    },
  };
}
