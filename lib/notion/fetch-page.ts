import { BlogPage, IDString } from "../memo-types";
import { ExtendedRecordMap, SearchParams, SearchResults } from "notion-types";
import { Client } from "@notionhq/client";
import { NotionCompatAPI } from "notion-compat";
import { NotionPage } from "./notion-page";

import fs from "fs";

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
  return await Promise.all(results);
}

const notionCacheFile = "./.next/cache/my-notion.json";
const notionCacheFileLock = "./.next/cache/my-notion.json.lock";
const cacheActiveTime = 1000 * 60;

function saveCache(pages: NotionPage[]): Promise<null> {
  const cache = JSON.stringify(pages);
  return new Promise((ok, ng) => {
    fs.writeFile(notionCacheFile, cache, (err) => {
      if (err) {
        ng(err);
      } else {
        ok(null);
      }
    });
  });
}
function loadCache(): Promise<NotionPage[]> {
  return new Promise((ok, ng) => {
    fs.readFile(notionCacheFile, (err, data) => {
      if (err) {
        ng(err);
      } else {
        ok(JSON.parse(data.toString()));
      }
    });
  });
}

function lastCached(): Promise<Date> {
  return new Promise((ok, ng) => {
    fs.stat(notionCacheFile, (err, stats) => {
      if (err) {
        ok(null);
      } else {
        ok(new Date(stats.mtime));
      }
    });
  });
}
async function cacheOK(): Promise<boolean> {
  const now = new Date();
  const last = await lastCached();
  return last && now.getTime() - last.getTime() < cacheActiveTime;
}

import lockfile from "lockfile";

export function fetchNotion(): Promise<NotionPage[]> {
  return new Promise((ok, ng) => {
    console.log(`fetchNotion: Start fetch pages`);
    lockfile.lock(
      notionCacheFileLock,
      { retries: Infinity, retryWait: 1000 },
      (err) => {
        if (err) {
          ng(err);
          return;
        }
        const release = () =>
          lockfile.unlock(notionCacheFileLock, function (err) {
            if (err) {
              ng(err);
            }
          });

        cacheOK().then((c) => {
          if (c) {
            console.log("fetchNotion: Using cached pages");
            release();
            ok(loadCache());
          } else {
            console.warn("fetchNotion: Fetching Notion pages");
            getDatabase(BlogID).then((pages) => {
              saveCache(pages).then(() => {
                console.log(`fetchNotion: Fetched ${pages.length} pages`);
                release();
                ok(pages);
              });
            });
          }
        });
      }
    );
  });
}

export async function fetchNotionInfo(): Promise<NotionPage[]> {
  const pages = await fetchNotion();
  return pages.map((page) => {
    return { ...page, recordMap: null };
  });
}
export async function fetchNotionPage(id: IDString): Promise<NotionPage[]> {
  const pages = await fetchNotion();
  return pages.map((page) => {
    return {
      ...page,
      recordMap: page.id === id ? page.recordMap : null,
    };
  });
}
