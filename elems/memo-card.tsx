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
              width: calc((960px - 3rem) / 2);
              height: 100%;
              border-radius: 12px;
              cursor: pointer;
              display: flex;
              flex-flow: column;
              position: relative;

              box-shadow: -2px 0 var(--main-color), -4px 0 #000,
                -8px 0 var(--main-color), 2px 0 var(--main-color), 4px 0 #000,
                8px 0 var(--main-color), -2px 1px var(--main-color) inset,
                2px 1px var(--main-color) inset,
                -2px -1px var(--main-color) inset,
                2px -1px var(--main-color) inset;
              padding: 1rem 3rem 1rem 3rem;
            }
            .card h2 {
              color: var(--sub-lighter-color);
              padding: 0;
              margin: 0;
              line-height: 1.5;
              font-size: 1.5rem;
            }
            .card:hover {
              transform: translate(2px, 2px);
            }
            p {
              margin: 1rem 0 2.5rem 0;
              opacity: 95%;
              font-weight: bold;
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
        <object className="chip-cont" key={tag}>
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
          position: absolute;
          bottom: 1rem;
        }
        .chip {
          color: var(--sub-lighter-color);
          font-weight: bold;
        }
        .chip-cont:hover {
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
          gap: 2rem 3rem;
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
