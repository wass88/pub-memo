import { useEffect, useRef, useState } from "react";
import { A, Btn } from "../../elems/base";
import { Player, Action } from "./ororo-player";
import {
  ruleKana,
  RuleSelector,
  useConfigReducer,
} from "./ororo-rule-selector";
import * as O from "./ororo";

type GameState = {
  view: O.View;
  first: boolean;
  record: O.Action[];
  config: O.Config;
  bots: [O.Agent, O.Agent];
  busy: boolean;
};
function useOroroReducer(config: O.Config): [GameState, (a: Action) => void] {
  const game = useRef(new O.Game(new O.State(config)));
  const [view, setView] = useState<GameState>({
    view: game.current.state.view(),
    first: game.current.state.first,
    record: game.current.state.record,
    config: config,
    bots: [null, null],
    busy: game.current.busy,
  });
  const update = () => {
    setView({
      view: game.current.state.view(),
      first: game.current.state.first,
      record: game.current.state.record,
      config: game.current.state.config,
      bots: game.current.bots,
      busy: game.current.busy,
    });
  };
  if (
    game.current.state.record.length === 0 &&
    config.rule.ruleStr !== game.current.state.config.rule.ruleStr
  ) {
    game.current = new O.Game(new O.State(config), game.current.bots);
    update();
  }
  const action = (action: Action) => {
    if (action.type === "play") {
      game.current.play(
        {
          pos: action.pos,
          posTo: action.posTo,
          first: action.first,
          pass: action.pass,
        },
        (bot, back) => {
          if (bot) {
            setTimeout(() => {
              update();
              setTimeout(() => back(), 4000);
            }, 200);
          } else {
            setTimeout(() => {
              update();
              update();
              setTimeout(() => {
                back();
              }, 1);
            }, 1);
          }
        }
      );
    } else if (action.type === "init") {
      game.current = new O.Game(new O.State(config), action.bots);
      update();
      game.current.kickBotStart(update);
    }
  };

  return [view, action];
}

export function Ororo({}) {
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
  const winMsg = " あなたの勝ち🎉";
  const loseMsg = " あなたの負け";
  const winnerMsg =
    state.view.result === O.Piece.First
      ? msgBot(loseMsg, winMsg)
      : state.view.result === O.Piece.Second
      ? msgBot(winMsg, loseMsg)
      : "";
  const pointMsg = `黒 ${state.view.scores[0]} - ${state.view.scores[1]} 白`;
  const botMsg = state.busy ? `Botの考慮中... ` : "";

  const message =
    state.view.result === O.Piece.Blank ? (
      <>
        {state.first ? "先手黒" : "後手白"}陣営の手番。{botMsg}
        {notStarted && !state.busy ? "盤面クリックでスタート" : pointMsg}
      </>
    ) : state.view.result === O.Piece.Draw ? (
      <>引き分けです。{pointMsg}</>
    ) : (
      <>
        {state.view.result === O.Piece.First ? "先手黒陣営" : "後手白陣営"}
        の勝利。{pointMsg}
        {winnerMsg}
      </>
    );

  const otherMode = notStarted ? (
    <p>
      <Btn
        onClick={() =>
          action({
            type: "init",
            bots: [null, O.createMCTSAgent(10)],
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
            bots: [O.createMCTSAgent(10), null],
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
      <RuleSelector
        rule={config.rule.ruleStr}
        setRule={setRule}
        disable={!notStarted}
      ></RuleSelector>
      <p>{message}</p>
      <Player
        view={state.view}
        action={action}
        first={state.first}
        busy={state.busy}
      ></Player>
      <style jsx>{`
        .cont {
          margin-block-end: 1rem;
        }
      `}</style>
      <RuleText rule={config.rule.ruleStr}></RuleText>
    </div>
  );
}

function RuleText({ rule }: { rule: string }) {
  const youMe = (me) => (me == "O" ? "自分(Own)の石" : "相手(Enemy)の石");
  const setYouMe = (set, me) => (set == "_" ? "空きマス" : youMe(me));
  const turn = (set, me) =>
    set == "_" ? (
      <>
        そこにも<em>{youMe(me)}</em>を置く
      </>
    ) : set == "S" ? (
      "ひっくり返す(Set)"
    ) : (
      "そのままにする(Reset)"
    );
  return (
    <>
      <h2>『{ruleKana(rule)}』のルール</h2>
      <ul>
        <li>
          交互に <em>{youMe(rule[1])}</em> を置く場所を選ぶ。
        </li>
        <li>
          置く場所から8方向に <em>{setYouMe(rule[2], rule[3])}</em>{" "}
          の並びを確認する。
          <em>{turn(rule[2], rule[3])}</em>。
        </li>
        <li>
          並びの先に <em>{setYouMe(rule[4], rule[5])}</em> があれば、
          <em>{turn(rule[4], rule[5])}</em>。これらを実行できる。
        </li>
        <li>何も実行できなければ、相手の番になる。</li>
        {(() => {
          let special = {
            _OSERO: "要するにオセロです。",
            _ESORE: "つまり、負けることを目指すオセロ。",
            _O_O_O: "スプラトゥーン？",
            _ORORO: "注: ゲーム性は保証しません。ほらね。",
            _ORERO: "チョコクッキー！",
            _OSESO: "つまり、オセロっぽいけど、挟む自分の石もひっくり返す。",
          }[rule];
          if (special) return <li>{special}</li>;
          else <li>注: ゲーム性は保証しません。</li>;
        })()}

        <li>
          <A href="http://kusabazyun.banjoyugi.net/Home/reproductioned/fairy/oserobarieshon">
            参考: オセロバリエーション紹介 -
            ゲーム研究家・草場純さんの研究を収集するサイト
          </A>
        </li>
        <li>
          <A href="https://adventar.org/calendars/7522">
            ボードゲーム・パズルプログラミング Advent Calendar 2022の20日目。
          </A>
          <ul>
            <li>ボードゲーム生成プログラミングということで登録。</li>
          </ul>
        </li>
      </ul>
    </>
  );
}
