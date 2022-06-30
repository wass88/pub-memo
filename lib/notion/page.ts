import { BlogPage, IDString } from "../memo-types";
import { NotionAPI } from "notion-client";
import { Client } from "@notionhq/client";
import { errorMonitor } from "events";
import { Recoverable } from "repl";

export type NotionBody = {
  body: NotionBlock[];
};
export type NotionData = {
  id: IDString;
  title: string;
  summary: string;
  body: NotionBody;
  tags: string[];
};

export function notion2Blog(data): BlogPage {}

const notion = new NotionAPI({ auth: process.env.NOTION_KEY });

const BlogID = process.env.NOTION_BLOG_ID;

export async function fetchNotion(): NotionData[] {
  let pageCursor = "";
  const pages = [];
  while (true) {
    const resp = await notion.databases.query({
      database_id: BlogID,
      filter: {
        property: "Public",
        checkbox: {
          equals: true,
        },
      },
    });

    resp.results.forEach(async (page) => {
      pages.push({
        pageID: page.id,
        emoji: page.icon?.emoji,
        describe: page.properties.Describe,
        recordsMap: await fetchBlocks(page.id),
      });
    });
    if (!resp.has_more) {
      break;
    }
    pageCursor = resp.next_cursor;
  }
  return await Promise.all(pages);
}

async function fetchBlocks(id: string) {
  let blockCursor = "";
  const blocks = [];
  while (true) {
    const resp = await notion.blocks.children.list({ block_id: id });
    blocks.push(...resp.results);
    if (!resp.has_more) {
      break;
    }
    blockCursor = resp.next_cursor;
  }
  return blocks;
}
