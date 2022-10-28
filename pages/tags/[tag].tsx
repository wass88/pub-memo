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
          .tags {
            display: flex;
            flex-flow: row wrap;
            gap: 8px;
          }
          .chip {
            padding: 2px 16px;
            font-weight: bold;
            border-radius: 24px;
            color: var(--fg-color);
            background: var(--sub-dark-color);
          }
          .chip:hover {
            transform: scale(1.1);
          }
        `}</style>
        <div className="tags">
          {memos.tags().map((tag) => (
            <object key={tag}>
              <Link href={`/tags/${tag}`} passHref>
                <a>
                  <div className="chip">{tag}</div>
                </a>
              </Link>
            </object>
          ))}
        </div>
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
