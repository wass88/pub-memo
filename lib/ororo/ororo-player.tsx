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

export function View({
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
          --size: 64px;
          width: var(--size);
          height: var(--size);
          background: #3c7400;
        }
        .playable {
          cursor: pointer;
          box-shadow: inset 1px 1px white, inset -1px -1px white;
        }
        .piece {
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          background: white;
        }
        .second {
          color: black;
        }
        .flip {
          animation: 1s ease forwards flip-rev;
        }
        .flip.first {
          animation: 1s ease forwards flip;
        }
        .ready-put {
          opacity: 50%;
        }
        .ready-rev {
          transform: rotate3d(1, -1, 0, 0.1turn);
        }
        .ready-rev.second {
          transform: rotate3d(1, -1, 0, 0.4turn);
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
          30% {
            background: white;
          }
          40% {
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
      `}</style>
    </div>
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