import { BlogPage } from "./memo-types";
import memos from "./memo-data";
import "../memos/2021-10-29-nextjs";
import "../memos/2022-05-27-more-ultimate-ticktacktoe";
import "../memos/2022-12-20-osero-ororo";
export default memos;

export function getDate(memo: BlogPage): string {
  return memo.id.match(/\d+-\d+-\d+/)[0];
}
