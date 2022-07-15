import memos from "../lib/memos";
import { fetchNotionInfo } from "../lib/notion/fetch-page";

export async function getStaticProps() {
  return {
    props: {
      notion: await fetchNotionInfo(),
    },
  };
}

export default function Home({ notion }) {
  memos.addNotion(notion);
  return <p>LastUpdate{memos.getLastUpdated()}</p>;
}
