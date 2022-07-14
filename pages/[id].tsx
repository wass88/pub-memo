import Head from "next/head";
import Link from "next/link";
import FullPage, { Descriptions } from "../elems/full-page";
import memos, { getDate } from "../lib/memos";
import { MemoList } from "../elems/memo-card";
import { A } from "../elems/base";
import { fetchNotionInfo, fetchNotionPage } from "../lib/notion/fetch-page";

function MemoPage({ id, notion }) {
  memos.addNotion(notion);
  const memo = memos.get(id);
  return (
    <FullPage>
      <Descriptions
        title={`${memo.title} - wassのメモ書き`}
        description={`${memo.title} -- ${memo.summary}`}
      ></Descriptions>
      <Link href={`/${id}`} passHref>
        <a>
          <h1>{memo.title}</h1>
        </a>
      </Link>
      <div className="sub-info">
        <span>作成日: {getDate(memo)}</span>
      </div>
      <memo.body></memo.body>
      <aside>
        <p>
          <A
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `${memo.title}\nhttps://memo.wass80.xyz/${id}`
            )}`}
          >
            Twitterで共有する
          </A>
        </p>
        <Link href="/" passHref>
          <a>
            <h1>最新の記事</h1>
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
  memos.addNotion(await fetchNotionInfo());
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
      notion: await fetchNotionPage(params.id),
    },
  };
}
