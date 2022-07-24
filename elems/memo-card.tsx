import React from "react";
import { BlogPage } from "../lib/memo-types";
import Link from "next/link";

export function MemoCard({ memo }: { memo: BlogPage }) {
  return (
    <Link href={`/${memo.id}`} passHref>
      <a>
        <div className="card">
          <h2>{memo.title}</h2>
          <p>{memo.summary}</p>
          <Tags tags={memo.tags}></Tags>
          <style jsx>{`
            .card {
              background: var(--fg-color);
              width: calc((960px - 16px) / 2);
              border-radius: 12px;
              color: var(--sub-darker-color);
              cursor: pointer;
              padding: 0 12px 12px 12px;
              display: flex;
              flex-flow: column;
            }
            .card h2 {
              margin: 0 -12px 0 -12px;
              line-height: 1.25;
              background: var(--sub-dark-color);
              padding: 16px;
              border-radius: 12px 12px 0 0;
              color: var(--fg-color);
              font-weight: bold;
              text-shadow: 1px 1px var(--sub-dark-color);
            }
            .card:hover {
              transform: translate(2px, 2px);
            }
            p {
              margin: 12px 0 12px 0;
              opacity: 80%;
            }
            @media screen and (max-width: 960px) {
              .card {
                width: initial;
              }
            }
          `}</style>
        </div>
      </a>
    </Link>
  );
}

export function Tags({ tags }) {
  return (
    <div className="tags">
      {tags.map((tag) => (
        <object key={tag}>
          <Link href={`/tags/${tag}`} passHref>
            <a>
              <div className="chip">{tag}</div>
            </a>
          </Link>
        </object>
      ))}
      <style jsx>{`
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
    </div>
  );
}

export function MemoList({ memos }: { memos: BlogPage[] }) {
  return (
    <div className="column">
      {memos.map((memo) => {
        return <MemoCard key={memo.id} memo={memo}></MemoCard>;
      })}
      <style jsx>{`
        .column {
          width: 100%;
          display: flex;
          flex-flow: row wrap;
          gap: 16px;
        }
        @media screen and (max-width: 960px) {
          .column {
            flex-flow: column;
          }
        }
      `}</style>
    </div>
  );
}
