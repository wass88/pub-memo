import { BlogPage, IDString } from "../memo-types";
import { ExtendedRecordMap, SearchParams, SearchResults } from "notion-types";
import { Client } from "@notionhq/client";
import { NotionCompatAPI } from "notion-compat";
import { NotionPage, blogFromNotion as blogFromNotion_ } from "./notion-page";

export const notion = new Client({ auth: process.env.NOTION_KEY });
export const notionCompat = new NotionCompatAPI(notion);

const BlogID = process.env.NOTION_BLOG_ID;

async function respToPage(result): Promise<NotionPage> {
  function notionPageID(date: string, id: string): IDString {
    return `${date.substring(0, 10)}-${id}` as IDString;
  }
  function plainText(o): string {
    return o.map((p) => p.plain_text).join("");
  }
  return {
    notionID: result.id,
    id: notionPageID(
      result.properties.PublishedAt.date.start,
      plainText(result.properties.ID.rich_text)
    ),
    icon: result.icon.emoji,
    tags: result.properties.Tags.multi_select.map((t) => t.name),
    title: plainText(result.properties.Name.title),
    summary: plainText(result.properties.Summary.rich_text),
    recordMap: await notionCompat.getPage(result.id),
  };
}

async function getDatabase(id: string): Promise<NotionPage[]> {
  const results = [];
  let i = 10;
  let cursor = undefined;
  while (i-- > 0) {
    const resp = await notion.databases.query({
      database_id: id,
      filter: {
        property: "PublishedAt",
        date: {
          is_not_empty: true,
        },
      },
      start_cursor: cursor,
    });
    resp.results.forEach((result) => {
      if (result.object !== "page") return;
      results.push(respToPage(result));
    });
    if (!resp.has_more) {
      break;
    }
    cursor = resp.next_cursor;
  }
  console.log(`Got ${results.length} pages`);
  return await Promise.all(results);
}

const notionCache: { pages?: NotionPage[] } = {
  pages: undefined,
};

export async function fetchNotion(): Promise<NotionPage[]> {
  console.log(`Fetching Notion pages..? cache: ${notionCache.pages}`);
  if (notionCache.pages) {
    console.log("Using cached pages");
    return notionCache.pages;
  }
  console.warn("Fetching Notion pages");
  notionCache.pages = await getDatabase(BlogID);
  console.log(`Fetched ${notionCache.pages.length} pages`);
  return notionCache.pages;
}

export const blogFromNotion = blogFromNotion_;
