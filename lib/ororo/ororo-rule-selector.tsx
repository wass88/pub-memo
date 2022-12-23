import * as O from "./ororo";
import { useEffect, useRef, useState } from "react";

export function useConfigReducer(): {
  config: O.Config;
  setRule: (string) => void;
  setSize: (number) => void;
} {
  const [rule, setRule] = useState(() => "_ESOSO");
  const [boardSize, setSize] = useState(() => 6);

  const checker = true; // TODO
  const config = {
    rule: O.createRule(rule),
    boardSize,
    initPiece: O.initPiece(checker, boardSize),
  };
  return { config, setRule, setSize };
}
export function ruleKana(rule: string): string {
  return [0, 2, 4]
    .map((i) => {
      return {
        _O: "オ",
        _E: "エ",
        SO: "ソ",
        SE: "セ",
        RO: "ロ",
        RE: "レ",
      }[rule.substring(i, i + 2)];
    })
    .join("");
}
export function RuleSelector({
  rule,
  setRule,
  disable,
}: {
  rule: string;
  setRule: (string) => void;
  disable: boolean;
}) {
  return (
    <span className={`selector ${disable ? "disable" : "enable"}`}>
      <span>{ruleKana(rule)}</span>:
      {rule.split("").map((c, i) => {
        const rotOE = (c) => (c === "O" ? "E" : "O");
        const rot_SR = (c) => (c === "_" ? "S" : c === "S" ? "R" : "_");
        const changeRule = (c, i) =>
          setRule(`${rule.substring(0, i)}${c}${rule.substring(i + 1)}`);
        const change = () => {
          if (disable) return;
          if (i === 0) return;
          if (i === 1) changeRule(rotOE(c), 1);
          if (i === 2) changeRule(rot_SR(c), 2);
          if (i === 3) changeRule(rotOE(c), 3);
          if (i === 4) changeRule(rot_SR(c), 4);
          if (i === 5) changeRule(rotOE(c), 5);
        };
        return (
          <span key={i} className={`char char${i}`} onClick={change}>
            {c}
          </span>
        );
      })}
      <style jsx>{`
        .selector {
          font-size: 200%;
        }
        .selector:hover {
          background-color: rgba(255 255 255 / 0.1);
        }
        .enable .char:not(.char0) {
          cursor: pointer;
          user-select: none;
        }
        .enable .char:not(.char0):hover {
          text-shadow: 1px 1px 3px white;
        }
        .char0,
        .char2,
        .char4 {
          margin-left: 1rem;
        }
      `}</style>
    </span>
  );
}
