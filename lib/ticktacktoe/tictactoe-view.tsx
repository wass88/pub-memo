import { useRef, useState } from "react";
import { Btn } from "../../elems/base";
import * as T from "./ticktacktoe";

function resultStr(result: T.Piece): string {
  return result === T.Piece.First
    ? "first"
    : result === T.Piece.Second
    ? "second"
    : result === T.Piece.Draw
    ? "draw"
    : "blank";
}
function Cell({
  piece,
  playable,
  onClick,
}: {
  piece: T.Piece;
  playable?: boolean;
  onClick?;
}) {
  return (
    <span
      className={`cell ${playable ? "playable" : ""} ${resultStr(piece)}`}
      onClick={onClick}
    >
      {piece === T.Piece.First ? "◯" : piece === T.Piece.Second ? "✕" : "・"}

      <style jsx>{`
        .cell {
          width: 24px;
          height: 24px;
          font-size: 16px;
          background: #111;
          text-align: center;
          line-height: 22px;
        }
        .playable {
          cursor: pointer;
          font-weight: bold;
          text-shadow: 1px 1px white, -1px -1px white, 1px -1px white,
            -1px 1px white;
        }
        .first {
          color: red;
        }
        .second {
          color: cyan;
        }
      `}</style>
    </span>
  );
}
function View({
  board,
  action,
  first,
  top,
}: {
  board: T.View;
  action: any;
  first: boolean;
  top: boolean;
}) {
  if (board.type === "leaf") {
    return (
      <Cell
        piece={board.result}
        playable={board.playable}
        onClick={
          board.playable
            ? () => {
                action({
                  type: "play",
                  pos: board.pos,
                  first: first,
                });
              }
            : () => {}
        }
      ></Cell>
    );
  }
  const nodes = board.board.map((b, i) => {
    return (
      <View board={b} key={i} action={action} first={first} top={false}></View>
    );
  });
  const rnodes = [];
  for (let i = 0; i < 9; i += 3) {
    rnodes.push(nodes.slice(i, i + 3));
  }
  return (
    <div className={`${resultStr(board.result)} ${top ? "top" : "sub"}`}>
      {rnodes.map((r, i) => (
        <div key={i} className={`row`}>
          {r}
        </div>
      ))}
      <style jsx>
        {`
          .row {
            display: flex;
          }
          .sub,
          .top {
            padding: 4px;
            border-radius: 4px;
          }
          .first {
            border: 1px solid red;
          }
          .second {
            border: 1px solid cyan;
          }
          .draw {
            border: 1px solid gray;
          }
        `}
      </style>
    </div>
  );
}

type Action = {
  type: "play";
  pos: number[];
  first: boolean;
};
function useTicTacToeReducer(): [
  { board: T.View; first: boolean; record: T.Action[] },
  (a: Action) => void
] {
  const state = useRef(new T.State({ rank: 3 }));
  const [view, setView] = useState({
    board: state.current.view(),
    first: state.current.first,
    record: state.current.record,
  });
  const action = (action: Action) => {
    if (action.type === "play") {
      state.current.play({ pos: action.pos, first: action.first });
      setView({
        board: state.current.view(),
        first: state.current.first,
        record: state.current.record,
      });
    }
  };

  return [view, action];
}
export function TicTacToe({}) {
  const [state, action] = useTicTacToeReducer();
  const message =
    state.board.result === T.Piece.Blank ? (
      <>
        <Cell piece={state.first ? T.Piece.First : T.Piece.Second}></Cell>{" "}
        の手番
      </>
    ) : state.board.result === T.Piece.Draw ? (
      "ひきわけ"
    ) : (
      <>
        <Cell piece={state.board.result}></Cell> の勝利
      </>
    );
  const otherMode =
    state.record.length === 0 ? (
      <Btn onClick={() => alert("XSS")}>次元を下げる</Btn>
    ) : (
      <></>
    );

  return (
    <div>
      <View
        board={state.board}
        action={action}
        first={state.first}
        top={true}
      ></View>
      {otherMode}
      <p>{message}</p>
    </div>
  );
}
