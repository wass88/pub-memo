import Head from "next/head";
import Link from "next/link";
import FullPage from "../elems/full-page";
import memos from "../lib/memos";

function MemoPage({ id }) {
  const memo = memos.get(id);
  return (
    <FullPage>
      <Head>
        <meta name="description" content={`${memo.title} -- ${memo.summary}`} />
        <meta name="date" content={memo.id.match(/\d+-\d+-\d+/)[0]} />
        <title>{memo.title} - wassのメモ書き</title>
      </Head>
      <nav>
        <Link href="/" passHref>
          <span>メモ書き</span>
        </Link>
        {" > "}
        {memo.tags.map((tag) => (
          <Link key={tag} href={`/tags/${tag}`} passHref>
            <span>{tag + " "}</span>
          </Link>
        ))}
      </nav>
      <h1>{memo.title}</h1>
      <div>
        <span>{memo.id}</span>
      </div>
      <memo.body></memo.body>
      <aside>
        <Link href="/" passHref>
          <h1>他のメモ</h1>
        </Link>
        {memos.getAll().map((memo) => {
          return (
            <Link key={memo.id} href={`/${memo.id}`} passHref>
              <div key={memo.id}>
                <h2>{memo.title}</h2>
              </div>
            </Link>
          );
        })}
      </aside>
      <style jsx>{`
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
