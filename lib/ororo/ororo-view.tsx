import { useEffect, useRef, useState } from "react";
import { Btn } from "../../elems/base";
import { View, Action } from "./ororo-player";
import { RuleSelector, useConfigReducer } from "./ororo-rule-selector";
import * as O from "./ororo";

type GameState = {
  view: O.View;
  first: boolean;
  record: O.Action[];
  config: O.Config;
  bots: [O.Agent, O.Agent];
};
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
