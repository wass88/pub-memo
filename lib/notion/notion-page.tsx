import { BlogPage, IDString } from "../memo-types";
import { ExtendedRecordMap } from "notion-types";

import { NotionRenderer } from "react-notion-x";
import { useNotionContext, cs, defaultMapImageUrl } from "react-notion-x";
import { getBlockTitle } from "notion-utils";
import Link from "next/link";
import { Collection } from "react-notion-x/build/third-party/collection";

import TweetEmbed from "react-tweet-embed";

import Code_ from "../../elems/code";
import { IconEmoji } from "../../elems/full-page";

export type NotionPage = {
  id: IDString;
  notionID: string;
  title: string;
  summary: string;
  recordMap: ExtendedRecordMap;
  tags: string[];
  icon: string;
  lastUpdated: string;
};

function Code({ block, defaultLanguage = "javascript" }) {
  const { recordMap } = useNotionContext();
  const content = getBlockTitle(block, recordMap);
  const language = (
    block.properties?.language?.[0]?.[0] || defaultLanguage
  ).toLowerCase();

  // const caption = block.properties.caption;
  return (
    <>
      <Code_ lang={language}>{content}</Code_>
    </>
  );
}

const Tweet = ({ id }: { id: string }) => {
  return <TweetEmbed tweetId={id} />;
};

import Katex from "@matejmazur/react-katex";
import { EquationBlock } from "notion-types";

const katexSettings = {
  throwOnError: false,
  strict: false,
};

const Equation: React.FC<{
  block: EquationBlock;
  math?: string;
  inline?: boolean;
  className?: string;
}> = ({ block, math, inline = false, className, ...rest }) => {
  const { recordMap } = useNotionContext();
  math = math || getBlockTitle(block, recordMap);
  if (!math) return null;

  return (
    <span
      className={cs(
        "notion-equation",
        inline ? "notion-equation-inline" : "notion-equation-block",
        className
      )}
    >
      <Katex math={math} settings={katexSettings} {...rest} />
    </span>
  );
};

function Image({ src, alt }) {
  return <img src={src} alt={alt} />;
}
function mapImageUrl(url: string, block) {
  if (url.startsWith("/notion-images")) {
    return url;
  }
  return defaultMapImageUrl(url, block);
}

export function blogFromNotion(page: NotionPage): BlogPage {
  const body = (prop) => (
    <>
      {page.icon ? <IconEmoji emoji={page.icon}></IconEmoji> : <></>}
      <NotionRenderer
        recordMap={page.recordMap}
        mapImageUrl={mapImageUrl}
        components={{
          Code,
          Equation,
          nextLink: Link,
          Image: Image,
          Tweet,
          Collection,
        }}
        darkMode
      ></NotionRenderer>
    </>
  );
  return {
    id: page.id,
    title: page.title,
    summary: page.summary,
    body,
    tags: page.tags,
  };
}
