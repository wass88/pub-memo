import { useState } from "react";
import * as O from "./ororo";

export type Action =
  | {
      type: "play";
      pos: [number, number];
      posTo?: [number, number];
      first: boolean;
      pass: boolean;
    }
  | {
      type: "init";
      bots: [O.Agent, O.Agent];
    };

export function Player({
  view,
  action,
  first,
}: {
  view: O.View;
  action: (action: Action) => void;
  first: boolean;
}) {
  const [cursor, setCursor] = useState(() => null);
  console.log(view.playChange);
  return (
    <>
      <div
        className={`view ${
          view.result === O.Piece.Blank
            ? first
              ? "view-wait view-first"
              : "view-wait view-second"
            : "view-end"
        }`}
      >
        {view.board.map((row, y) => {
          return (
            <div className="row" key={y}>
              {row.map((piece, x) => {
                const playable = playableIn(view.playable, y, x);
                const onClick = () => {
                  if (playable) {
                    action({ type: "play", pos: [y, x], first, pass: false });
                  }
                };
                const cursorActive = cursor && cursor[0] == y && cursor[1] == x;
                const enterCursor = () => {
                  setCursor([y, x]);
                };
                const leaveCursor = () => {
                  setCursor(null);
                };
                const lastSet = view.lastSet.some(
                  ([py, px]) => py == y && px == x
                );
                let readyPut = false;
                let readySet = false;
                let readyPutPiece = piece;
                if (cursor) {
                  for (let [py, px, p] of view.playChange[cursor[0]][cursor[1]]
                    .put) {
                    console.log({ py, px });
                    readyPut = py == y && px == x;
                    if (readyPut) {
                      readyPutPiece = p;
                      break;
                    }
                  }
                  readySet = view.playChange[cursor[0]][cursor[1]].set.some(
                    ([py, px]) => py == y && px == x
                  );
                }
                return (
                  <div
                    className={`cell ${playable ? "playable" : ""} ${
                      cursorActive && playable ? "cursor" : ""
                    }`}
                    key={`${y}-${x}`}
                    onClick={onClick}
                    onMouseEnter={enterCursor}
                    onMouseLeave={leaveCursor}
                  >
                    {readyPutPiece !== O.Piece.Blank ? (
                      <>
                        <div
                          className={`piece not-set ${resultStr(
                            readyPutPiece
                          )} ${lastSet ? "flip" : ""} ${
                            readyPut ? "ready-put" : ""
                          } ${readySet ? "ready-set" : ""}`}
                        ></div>
                        {/* WORKAROUND ひっくり返す例示のときに別要素で */}
                        <div
                          className={`piece set ${resultStr(readyPutPiece)} ${
                            readySet ? "ready-set" : ""
                          }`}
                        ></div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
        {view.playable.length > 0 && view.playable[0].pass ? (
          <div
            className="pass"
            onClick={() => {
              action({ type: "play", pos: null, first, pass: true });
            }}
          >
            パス
          </div>
        ) : (
          <></>
        )}
        <style jsx>{`
          .view {
            display: inline-block;
            --cell-color: #3c7400;
          }
          .row {
            display: flex;
            gap: 2px;
            margin-bottom: 2px;
          }
          .cell {
            --size: 64px;
            width: var(--size);
            height: var(--size);
            background: var(--cell-colorr);
            position: relative;
          }
          .playable {
            cursor: pointer;
            box-shadow: inset 1px 1px white, inset -1px -1px white;
          }
          .cursor:not(:has(:is(.first, .second))) {
            opacity: 90%;
          }
          .piece {
            position: absolute;
            top: 0;
            left: 0;
            width: var(--size);
            height: var(--size);
            border-radius: 50%;
            background: white;
            color: red;
          }
          .second {
            background: black;
          }
          .flip.first {
            animation: 1s ease forwards flip-rev;
          }
          .flip.second {
            animation: 1s ease forwards flip;
          }
          .ready-put {
            opacity: 50%;
          }
          .set {
            opacity: 0;
          }
          .set.ready-set.first {
            opacity: 1;
            display: initial;
            animation: 1s ease -0.5s paused forwards flip-rev;
          }
          .set.ready-set.second {
            opacity: 1;
            display: initial;
            animation: 1s ease -0.5s paused forwards flip;
          }
          .not-set.ready-set {
            opacity: 0;
          }

          .pass {
            width: 160px;
            height: 80px;
            line-height: 80px;
            text-align: center;
            font-size: 64px;
            background: #3c7400;
            color: white;
            cursor: pointer;
          }
          .cell {
            background: green;
          }
          @keyframes flip {
            from {
              background: white;
              transform: rotate3d(1, -1, 0, 0turn);
            }
            25% {
              background: white;
            }
            45% {
              background: black;
            }
            to {
              background: black;
              transform: rotate3d(1, -1, 0, 0.5turn);
            }
          }
          @keyframes flip-rev {
            from {
              background: black;
              transform: rotate3d(1, -1, 0, 0.5turn);
            }
            40% {
              background: black;
            }
            60% {
              background: white;
            }
            to {
              background: white;
              transform: rotate3d(1, -1, 0, 0turn);
            }
          }
          .view {
            box-shadow: 3px 3px var(--cell-color)), 
            -3px 3px var(--cell-color)), 
            3px -3px var(--cell-color)), 
            -3px -3px var(--cell-color));
          }
        `}</style>
      </div>
    </>
  );
}
function playableIn(acts: O.Action[], y: number, x: number) {
  return acts.some((act) => !act.pass && act.pos[0] === y && act.pos[1] === x);
}
function resultStr(result: O.Piece): string {
  return result === O.Piece.First
    ? "first"
    : result === O.Piece.Second
    ? "second"
    : result === O.Piece.Draw
    ? "draw"
    : "blank";
}
