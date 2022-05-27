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
          text-shadow: 1px 1px red, -1px -1px red, 1px -1px red, -1px 1px red;
        }
        .second {
          color: cyan;
          text-shadow: 1px 1px cyan, -1px -1px cyan, 1px -1px cyan,
            -1px 1px cyan;
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
            margin: 4px;
            border-radius: 4px;
            width: fit-content;
          }
          .blank {
            border: 2px solid transparent;
          }
          .first {
            border: 2px solid red;
          }
          .second {
            border: 2px solid cyan;
          }
          .draw {
            border: 2px solid gray;
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
      bots: [T.Agent, T.Agent];
    };
type GameState = {
  board: T.View;
  first: boolean;
  record: T.Action[];
  config: T.Config;
  bots: [T.Agent, T.Agent];
};
function useTicTacToeReducer(): [GameState, (a: Action) => void] {
  const initConfig = { rank: 2 };
  const game = useRef(new T.Game(new T.State(initConfig)));
  const [view, setView] = useState<GameState>({
    board: game.current.state.view(),
    first: game.current.state.first,
    record: game.current.state.record,
    config: initConfig,
    bots: [null, null],
  });
  const action = (action: Action) => {
    const update = () => {
      setView({
        board: game.current.state.view(),
        first: game.current.state.first,
        record: game.current.state.record,
        config: game.current.state.config,
        bots: game.current.bots,
      });
    };
    if (action.type === "play") {
      game.current.play({ pos: action.pos, first: action.first });
      update();
    } else if (action.type === "init") {
      game.current = new T.Game(new T.State(action.config), action.bots);
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
        <Cell piece={state.board.result}></Cell> の勝利。
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
            bots: state.bots,
          })
        }
        disabled={state.config.rank <= 1}
      >
        次元を減らす
      </Btn>{" "}
      <Btn
        onClick={() =>
          action({
            type: "init",
            config: { ...state.config, rank: state.config.rank + 1 },
            bots: state.bots,
          })
        }
        disabled={state.config.rank >= 5}
      >
        次元を増やす {state.config.rank === 4 ? "（非推奨）" : ""}
      </Btn>{" "}
      <Btn
        onClick={() =>
          action({
            type: "init",
            config: state.config,
            bots: [null, T.MinOpoAgent],
          })
        }
        disabled={state.bots[1] != null}
      >
        先手 vs Bot
      </Btn>{" "}
      <Btn
        onClick={() =>
          action({
            type: "init",
            config: state.config,
            bots: [T.MinOpoAgent, null],
          })
        }
        disabled={state.bots[0] != null}
      >
        Bot vs 後手
      </Btn>{" "}
      <Btn
        onClick={() =>
          action({
            type: "init",
            config: state.config,
            bots: [null, null],
          })
        }
        disabled={state.bots[0] == null && state.bots[1] == null}
      >
        先手 vs 後手
      </Btn>
    </p>
  ) : gameEnd ? (
    <p>
      <Btn
        onClick={() =>
          action({
            type: "init",
            config: state.config,
            bots: [null, null],
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
