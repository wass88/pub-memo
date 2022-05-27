import { useEffect, useRef, useState } from "react";
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
          font-weight: bold;
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
            width: fit-content;
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

type Action =
  | {
      type: "play";
      pos: number[];
      first: boolean;
    }
  | {
      type: "init";
      config: T.Config;
    };
function useTicTacToeReducer(): [
  { board: T.View; first: boolean; record: T.Action[]; config: T.Config },
  (a: Action) => void
] {
  const initConfig = { rank: 2 };
  const state = useRef(new T.State(initConfig));
  const [view, setView] = useState({
    board: state.current.view(),
    first: state.current.first,
    record: state.current.record,
    config: initConfig,
  });
  const action = (action: Action) => {
    const update = () => {
      setView({
        board: state.current.view(),
        first: state.current.first,
        record: state.current.record,
        config: state.current.config,
      });
    };
    if (action.type === "play") {
      state.current.play({ pos: action.pos, first: action.first });
      update();
    } else if (action.type === "init") {
      state.current = new T.State(action.config);
      update();
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
      "引き分けです。"
    ) : (
      <>
        <Cell piece={state.board.result}></Cell> の勝利。再読み込みで再戦です。
      </>
    );
  const notStarted = state.record.length === 0;
  const gameEnd = state.board.result !== T.Piece.Blank;
  useEffect(() => {
    const preventUnload = (e) => {
      if (!notStarted && !gameEnd) {
        e.returnValue = "試合中ですが、本当に閉じますか？";
      }
    };
    window.addEventListener("beforeunload", preventUnload);
    return () => window.removeEventListener("beforeunload", preventUnload);
  }, [notStarted, gameEnd]);
  const otherMode = notStarted ? (
    <p>
      <Btn
        onClick={() =>
          action({
            type: "init",
            config: { ...state.config, rank: state.config.rank - 1 },
          })
        }
        disabled={state.config.rank <= 1}
      >
        次元を下げる
      </Btn>{" "}
      <Btn
        onClick={() =>
          action({
            type: "init",
            config: { ...state.config, rank: state.config.rank + 1 },
          })
        }
        disabled={state.config.rank >= 5}
      >
        次元を上げる {state.config.rank === 4 ? "（非推奨）" : ""}
      </Btn>
    </p>
  ) : gameEnd ? (
    <p>
      <Btn
        onClick={() =>
          action({
            type: "init",
            config: state.config,
          })
        }
      >
        リセット
      </Btn>
    </p>
  ) : (
    <></>
  );

  return (
    <div className="cont">
      {otherMode}
      <p>{message}</p>
      <View
        board={state.board}
        action={action}
        first={state.first}
        top={true}
      ></View>
      <style jsx>{`
        .cont {
          margin-block-end: 1rem;
        }
      `}</style>
    </div>
  );
}
