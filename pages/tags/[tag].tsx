import Head from "next/head";
import Link from "next/link";
import FullPage from "../../elems/full-page";
import memos from "../../lib/memos";
import { MemoList, Tags } from "../../elems/memo-card";

import { fetchNotionInfo } from "../../lib/notion/fetch-page";

function TagPage({ tag, notion }) {
  memos.addNotion(notion);
  const tagged = memos.getByTag(tag);
  return (
    <FullPage>
      <Head>
        <meta name="description" content={`タグ {tag} メモ書きたち`} />
        <title>タグ: {tag} - wassのメモ書き</title>
      </Head>
      <h1>タグ「{tag}」</h1>
      <div>
        <MemoList memos={tagged} />
      </div>
      <aside>
        <h2>他のタグ</h2>
        <style jsx>{`
          h2 {
            margin-top: 16px;
          }
        `}</style>
        <Tags tags={memos.tags()}></Tags>
        <Link href="/">
          <a>
            <h2>全記事を見る</h2>
          </a>
        </Link>
      </aside>
    </FullPage>
  );
}
export default TagPage;

export async function getStaticPaths() {
  memos.addNotion(await fetchNotionInfo());
  return {
    paths: memos.tags().map((t) => {
      return {
        params: {
          tag: t,
        },
      };
    }),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      tag: params.tag,
      notion: await fetchNotionInfo(),
    },
  };
}
