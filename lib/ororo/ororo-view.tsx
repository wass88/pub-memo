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
    bots: [O.Agent, O.Agent];
  };
type GameState = {
  view: O.View;
  first: boolean;
  record: O.Action[];
  config: O.Config;
  bots: [O.Agent, O.Agent];
};
function useConfigReducer(): { config: O.Config, setRule: (string) => void, setSize: (number) => void } {
  const [rule, setRule] = useState(() => "_OSERO")
  const [boardSize, setSize] = useState(() => 6)

  const checker = true; // TODO
  const config = { rule: O.createRule(rule), boardSize, initPiece: O.initPiece(checker, boardSize) };
  return { config, setRule, setSize }
}
function useOroroReducer(config: O.Config): [GameState, (a: Action) => void] {
  const game = useRef(new O.Game(new O.State(config)));
  const [view, setView] = useState<GameState>({
    view: game.current.state.view(),
    first: game.current.state.first,
    record: game.current.state.record,
    config: config,
    bots: [null, null],
  });
  const update = () => {
    setView({
      view: game.current.state.view(),
      first: game.current.state.first,
      record: game.current.state.record,
      config: game.current.state.config,
      bots: game.current.bots,
    });
  };
  if (game.current.state.record.length === 0 && config.rule.ruleStr !== game.current.state.config.rule.ruleStr) {
    game.current = new O.Game(new O.State(config), game.current.bots);
    update();
  }
  const action = (action: Action) => {
    if (action.type === "play") {
      game.current.play({
        pos: action.pos,
        posTo: action.posTo,
        first: action.first,
        pass: action.pass,
      });
      update();
    } else if (action.type === "init") {
      game.current = new O.Game(new O.State(config), action.bots);
      update();
    }
  };

  return [view, action];
}

export function Ororo({ }) {
  const { config, setRule, setSize } = useConfigReducer();
  const [state, action] = useOroroReducer(config);
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
      <RuleSelector rule={config.rule.ruleStr} setRule={setRule} disable={!notStarted}></RuleSelector>
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

function RuleSelector({ rule, setRule, disable }: { rule: string, setRule: (string) => void, disable: boolean }) {
  return <div className={`selector ${disable ? "disable" : "enable"}`}>
    {rule.split("").map((c, i) => {
      const rotOE = (c) => c === "O" ? "E" : "O";
      const rot_SR = (c) => c === "_" ? "S" : c === "S" ? "R" : "_";
      const changeRule = (c, i) => setRule(`${rule.substring(0, i)}${c}${rule.substring(i + 1)}`)
      const change = () => {
        if (disable) return;
        if (i === 0) return;
        if (i === 1) changeRule(rotOE(c), 1)
        if (i === 2) changeRule(rot_SR(c), 2);
        if (i === 3) changeRule(rotOE(c), 3)
        if (i === 4) changeRule(rot_SR(c), 4);
        if (i === 5) changeRule(rotOE(c), 5)
      }
      return <span key={i} className={`char char${i}`} onClick={change}>{c}</span>
    })}
    <style jsx>{`
    .selector {
      font-size: 200%;
    }
    .enable .char {
      cursor: pointer;
    }
    .char2, .char4 {
      margin-left: 1rem;
    }
    `}</style>
  </div>
}