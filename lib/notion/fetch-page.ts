import { BlogPage, IDString } from "../memo-types";
import { BaseDecoration } from "notion-types";
import { Client } from "@notionhq/client";
import { NotionCompatAPI } from "notion-compat";
import { NotionPage } from "./notion-page";
import urlMetadata from "url-metadata";

import fs, { WriteStream } from "fs";

export const notion = new Client({ auth: process.env.NOTION_KEY });
export const notionCompat = new NotionCompatAPI(notion);

const BlogID = process.env.NOTION_BLOG_ID;

async function respToPage(result): Promise<NotionPage> {
  console.log("respToPage: ", result.id);
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
    icon: result.icon?.emoji ?? null,
    tags: result.properties.Tags.multi_select.map((t) => t.name),
    title: plainText(result.properties.Name.title),
    summary: plainText(result.properties.Summary.rich_text),
    recordMap: await notionCompat.getPage(result.id),
    lastUpdated: result.last_edited_time,
  };
}

async function getDatabase(id: string): Promise<NotionPage[]> {
  const results = [];
  let i = 10;
  let cursor = undefined;
  while (i-- > 0) {
    console.log(
      "getDatabase fetch retry: ",
      9 - i,
      "cursor: ",
      cursor ?? "none"
    );
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
  const pages = await Promise.all(results);
  console.log("getDatabase fetch end: ", pages.length);
  console.log("getDatabase replaceImagesInPage");
  await Promise.all(
    pages.map(async (page) => {
      await replaceImagesInPage(page);
    })
  );
  console.log("getDatabase appendBookmarkMeta");
  await Promise.all(
    pages.map(async (page) => {
      await appendBookmarkMeta(page);
    })
  );
  console.log("getDatabase Added Bookmark Meta: ", pages.length);
  return pages;
}

async function replaceImagesInPage(page) {
  return await Promise.all(
    Object.values(page.recordMap.block).map(async (record: any) => {
      if (record.type !== "reader") {
        return;
      }
      const value = record.value;
      if (value.type !== "image") {
        return;
      }
      const src = value.properties.source[0][0];
      const local = await downloadImage(src);
      value.properties.source[0][0] = local;
    })
  );
}

const cacheImageDir = "/notion-images";
const outDir = "./public";

import crypto from "crypto";

function downloadImage(src): Promise<string> {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  const saveDir = `${outDir}/${cacheImageDir}`;
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir);
  }
  function hash(url) {
    const m = src.match(/secure.notion-static.com\/([^\/]*)\//);
    if (m) return m[1];
    return crypto.createHash("md5").update(url).digest("hex");
  }
  const file = `${saveDir}/${hash(src)}`;
  const srcFile = `${cacheImageDir}/${hash(src)}`;
  return new Promise((ok, ng) => {
    https.get(src, (resp) => {
      if (resp.statusCode === 200) {
        resp
          .pipe(fs.createWriteStream(file))
          .on("error", ng)
          .once("close", () => {
            const filename = addExt(file, srcFile);
            filename.then(
              (s) => ok(s),
              (r) => ng(r)
            );
          });
      } else {
        resp.resume();
        ng(new Error(`Request Failed With a Status Code: ${resp.statusCode}`));
      }
    });
  });
}

import { Transform } from "stream";
import https from "https";
import { fileTypeFromFile } from "file-type";

async function addExt(file: string, srcFile: string): Promise<string> {
  const type = await fileTypeFromFile(file);
  return new Promise((ok, ng) => {
    fs.rename(file, `${file}.${type.ext}`, (err) => {
      if (err) {
        ng(err);
      }
      ok(`${srcFile}.${type.ext}`);
    });
  });
}

const notionCacheFile = "./.next/cache/my-notion.json";
const notionCacheFileLock = "./.next/cache/my-notion.json.lock";
const cacheActiveTime = 1000 * 60 * 30; // 30min Cache

function saveCache(pages: NotionPage[]): Promise<null> {
  console.log("saveCache", pages.length);
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

        (async function () {
          const c = await cacheOK();
          if (c) {
            console.log("fetchNotion: Using cached pages");
            release();
            ok(loadCache());
          } else {
            console.warn("fetchNotion: Fetching Notion pages");
            const pages = await getDatabase(BlogID);
            await saveCache(pages);
            console.log(`fetchNotion: Fetched ${pages.length} pages`);
            release();
            ok(pages);
          }
        })();
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

const links = new Set();
async function appendBookmarkMeta(page: NotionPage) {
  const block = page.recordMap.block;
  for (const record of Object.keys(block)) {
    const value = block[record].value;
    if (value.type !== "bookmark") continue;
    const link = value.properties.link[0][0];
    links.add(link);
    //console.log(`appendBookmarkMeta: ${Array.from(links)}`);
    var meta;
    try {
      meta = await urlMetadata(link, { timeout: 5000 });
    } catch (e) {
      console.error(`appendBookmarkMeta: ${e}`);
      continue;
    }
    value.properties.title = [[meta["og:title"] as string]];
    value.properties.description = [[meta.description as string]];
    if (meta["og:image"] !== "") {
      value.format.bookmark_cover = meta["og:image"] as string;
    }
    links.delete(link);
    //console.log(`appendBookmarkMeta: ${Array.from(links)}`);
  }
}
