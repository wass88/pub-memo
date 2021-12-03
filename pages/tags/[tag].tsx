import Head from "next/head";
import Link from "next/link";
import FullPage from "../../elems/full-page";
import memos from "../../lib/memos";

function TagPage({ tag }) {
  const tagged = memos.getByTag(tag);
  return (
    <FullPage>
      <Head>
        <meta name="description" content={`タグ {tag} メモ書きたち`} />
        <title>タグ: {tag} - wassのメモ書き</title>
      </Head>
      <nav>
        <Link href="/">
          <span>メモ書き</span>
        </Link>
        {" > タグ "} {tag}
      </nav>
      <h1>タグ「{tag}」のメモ書き</h1>
      <div>
        {tagged.map((memo) => {
          return (
            <Link href={`/${memo.id}`}>
              <div key={memo.id}>
                <h2>{memo.title}</h2>
              </div>
            </Link>
          );
        })}
      </div>
      <aside>
        <h2>他のタグ</h2>
        {memos.tags().map((t) => (
          <Link href={`/tags/${t}`}>
            <span>{t} </span>
          </Link>
        ))}
      </aside>
    </FullPage>
  );
}
export default TagPage;

export async function getStaticPaths() {
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
    },
  };
}
