import { useEffect, useRef, useState } from "react";
import { Btn } from "../../elems/base";
import * as O from "./ororo";

function resultStr(result: O.Piece): string {
  return result === O.Piece.First
    ? "first"
    : result === O.Piece.Second
      ? "second"
      : result === O.Piece.Draw
        ? "draw"
        : "blank";
}

type Action =
  | {
    type: "play";
    pos: [number, number];
    posTo?: [number, number];
    first: boolean;
    pass: boolean;
  }
  | {
    type: "init";
    config: O.Config;
    bots: [O.Agent, O.Agent];
  };
type GameState = {
  view: O.View;
  first: boolean;
  record: O.Action[];
  config: O.Config;
  bots: [O.Agent, O.Agent];
};
function useOroroReducer(): [GameState, (a: Action) => void] {
  const initConfig = { ...O.Osero, boardSize: 4, initPiece: O.initPiece(true, 4) };
  const game = useRef(new O.Game(new O.State(initConfig)));
  const [view, setView] = useState<GameState>({
    view: game.current.state.view(),
    first: game.current.state.first,
    record: game.current.state.record,
    config: initConfig,
    bots: [null, null],
  });
  const action = (action: Action) => {
    const update = () => {
      setView({
        view: game.current.state.view(),
        first: game.current.state.first,
        record: game.current.state.record,
        config: game.current.state.config,
        bots: game.current.bots,
      });
    };
    if (action.type === "play") {
      game.current.play({
        pos: action.pos,
        posTo: action.posTo,
        first: action.first,
        pass: action.pass,
      });
      update();
    } else if (action.type === "init") {
      game.current = new O.Game(new O.State(action.config), action.bots);
      update();
    }
  };

  return [view, action];
}

export function Ororo({ }) {
  const [state, action] = useOroroReducer();
  const notStarted = state.record.length === 0;
  const gameEnd = state.view.result !== O.Piece.Blank;

  useEffect(() => {
    const preventUnload = (e) => {
      if (!notStarted && !gameEnd) {
        e.returnValue = "試合中ですが、本当に閉じますか？";
      }
    };
    window.addEventListener("beforeunload", preventUnload);
    return () => window.removeEventListener("beforeunload", preventUnload);
  }, [notStarted, gameEnd]);
  const firstBot = state.bots[0] !== null;
  const secondBot = state.bots[1] !== null;
  const msgBot = (f, s) => (firstBot ? f : secondBot ? s : "");
  const winMsg = "あなたの勝ち";
  const loseMsg = "あなたの負け";
  const winnerMsg =
    state.view.result === O.Piece.First
      ? msgBot(loseMsg, winMsg)
      : state.view.result === O.Piece.Second
        ? msgBot(winMsg, loseMsg)
        : "";

  const message =
    state.view.result === O.Piece.Blank ? (
      <>
        {state.first ? "白" : "黒"}の手番{" "}
        {notStarted ? "盤面クリックでスタート" : ""}
      </>
    ) : state.view.result === O.Piece.Draw ? (
      "引き分けです。"
    ) : (
      <>
        {state.view.result} の勝利。
        {winnerMsg}
      </>
    );

  const otherMode = (notStarted) ? (
    <p>
      <Btn
        onClick={() =>
          action({
            type: "init",
            config: state.config,
            bots: [null, O.RandomAgent],
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
            bots: [O.RandomAgent, null],
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
  ) : (
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
  );
  return (
    <div className="cont">
      {otherMode}
      <p>{message}</p>
      <View view={state.view} action={action} first={state.first}></View>
      <style jsx>{`
        .cont {
          margin-block-end: 1rem;
        }
      `}</style>
    </div>
  );
}
function playableIn(acts: O.Action[], y: number, x: number) {
  return acts.some((act) => !act.pass && act.pos[0] === y && act.pos[1] === x);
}
function View({
  view,
  action,
  first,
}: {
  view: O.View;
  action: (action: Action) => void;
  first: boolean;
}) {
  return (
    <div className="view">
      {view.board.map((row, y) => {
        return <div className="row" key={y}>{row.map((piece, x) => {
          const playable = playableIn(view.playable, y, x);
          const onClick = () => {
            if (playable) {
              action({ type: "play", pos: [y, x], first, pass: false });
            }
          };
          return (
            <div className={`cell ${playable ? "playable" : ""}`} key={`${y}-${x}`} onClick={onClick}
            >
              {piece !== O.Piece.Blank ? (
                <div className={`piece ${resultStr(piece)}`} ></div>
              ) : (
                <></>
              )}
            </div>
          );
        })}</div>;
      })}
      {
        (view.playable.length > 0 && view.playable[0].pass) ?
          <div className="pass" onClick={() => {
            action({ type: "play", pos: null, first, pass: true });
          }}>パス</div>
          : <></>
      }
      <style jsx>{`
        .row {
          display: flex;
          gap: 2px;
          margin-bottom: 2px;
        }
        .cell {
          width: 64px;
          height: 64px;
          background: #3c7400;
        }
        .playable {
          cursor: pointer;
          box-shadow: inset 1px 1px white, inset -1px -1px white;
        }
        .piece {
          width: 64px;
          height: 64px;
          border-radius: 50%;
        }
        .first {
          background: #fff;
        }
        .second {
          background: #000;
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
      `}</style>
    </div>
  );
}
