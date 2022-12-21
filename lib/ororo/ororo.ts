export const Piece = {
  Blank: 0,
  First: 1,
  Second: 2,
  Draw: 3,
};
export type Piece = typeof Piece[keyof typeof Piece];

export type Config = {
  boardSize: number;
  rule: Rule;
  initPiece: [Piece, number, number][];
};

const d8 = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];
export type Rule =
  | {
      ruleStr: string;
      type: "normal";
      put: boolean;
      reach: Piece;
      reachTo: Piece;
      set: boolean;
      setTo: boolean;

      // _O SE RO
      // Put Own on Empty
      // Set Enemy
      // Reverse To Own
    }
  | {
      ruleStr: string;
      type: "sandwich";
      put: boolean;
      putTo: boolean;
      sand: Piece;
      set: boolean;
    }
  | {
      ruleStr: string;
      type: "extend";
      put: boolean;
      putIn: boolean;
      reachTo: Piece;
      set: boolean;
    }
  | {
      ruleStr: string;
      type: "fill";
      put: boolean;
      putIn: boolean;
      putTo: boolean;
    };

export function createRule(ruleStr: string): Rule {
  const [l, ls, m, ms, r, rs] = ruleStr.split("");
  const pieceChar = (p: string) => {
    if (p === "O") {
      return Piece.First;
    } else if (p === "E") {
      return Piece.Second;
    }
  };
  const [lp, mp, rp] = [ls, ms, rs].map(pieceChar);
  if ("_SR".indexOf(l) < 0) {
    throw new Error(`Invalid ruleStr[0]: ${ruleStr} `);
  }
  if ("_SR".indexOf(m) < 0) {
    throw new Error(`Invalid ruleStr[2]: ${ruleStr} `);
  }
  if ("_SR".indexOf(r) < 0) {
    throw new Error(`Invalid ruleStr[4]: ${ruleStr} `);
  }
  if ("OE".indexOf(ls) < 0) {
    throw new Error(`Invalid ruleStr[1]: ${ruleStr} `);
  }
  if ("OE".indexOf(ms) < 0) {
    throw new Error(`Invalid ruleStr[3]: ${ruleStr} `);
  }
  if ("OE".indexOf(rs) < 0) {
    throw new Error(`Invalid ruleStr[5]: ${ruleStr} `);
  }

  if (l === "_") {
    if (m === "_") {
      if (r === "_") {
        return {
          ruleStr,
          type: "fill",
          put: lp === Piece.First,
          putIn: mp === Piece.First,
          putTo: rp === Piece.First,
        };
      } else {
        return {
          ruleStr,
          type: "extend",
          put: lp === Piece.First,
          putIn: mp === Piece.First,
          reachTo: rp,
          set: r === "S",
        };
      }
    } else {
      if (r === "_") {
        return {
          ruleStr,
          type: "sandwich",
          put: lp === Piece.First,
          putTo: rp === Piece.First,
          sand: mp,
          set: m === "S",
        };
      } else {
        return {
          ruleStr,
          type: "normal",
          put: lp === Piece.First,
          reach: mp,
          reachTo: rp,
          set: m === "S",
          setTo: r === "S",
        };
      }
    }
  }
}

export type ruleAgent = {
  puts: 1 | 2;
  playBy(
    board: Piece[][],
    size: number,
    pos: [number, number] | [[number, number], [number, number]],
    first: boolean
  ): { put: [number, number, Piece][]; set: [number, number][] };
};

const seekD8 = (
  y: number,
  x: number,
  board: Piece[][],
  size: number,
  pieceIn: Piece,
  pieceTo: Piece
): [number, number][][] => {
  return d8.map(([dy, dx]) => {
    let [ny, nx] = [y + dy, x + dx];
    if (nx < 0 || ny < 0 || nx >= size || ny >= size) {
      return [];
    }
    if (board[ny][nx] !== pieceIn) {
      return [];
    }
    const rev: [number, number][] = [[ny, nx]];
    for (let i = 0; i < size + 1; i++) {
      [nx, ny] = [nx + dx, ny + dy];
      if (pieceIn === pieceTo) {
        // to All
        if (nx < 0 || ny < 0 || nx >= size || ny >= size) {
          return rev;
        }
        if (board[ny][nx] !== pieceIn) {
          return rev;
        }
      } else {
        // to Piece
        if (
          nx < 0 ||
          ny < 0 ||
          nx >= size ||
          ny >= size ||
          board[ny][nx] === Piece.Blank
        ) {
          return [];
        }
        if (board[ny][nx] === pieceTo) {
          rev.push([ny, nx]);
          return rev;
        }
      }
      rev.push([ny, nx]);
    }
  });
};
function swapIf(p: Piece, b: boolean): Piece {
  if (b) return p;
  if (p === Piece.First) {
    return Piece.Second;
  } else if (p === Piece.Second) {
    return Piece.First;
  }
  return p;
}
export const ruleToAgent = (rule: Rule): ruleAgent => {
  switch (rule.type) {
    case "normal":
      return {
        puts: 1,
        playBy: (board, size, pos, first) => {
          const [y, x] = pos as [number, number];
          const put: [number, number, Piece][] = [
            [y, x, first === rule.put ? Piece.First : Piece.Second],
          ];
          const set: [number, number][] = seekD8(
            y,
            x,
            board,
            size,
            swapIf(rule.reach, first),
            swapIf(rule.reachTo, first)
          ).flatMap((rev) => {
            return [...(rule.set ? rev.slice(0, -1) : []),
                    ...(rev.length > 0 && rule.setTo ? [rev[rev.length - 1]] : [])];
          });
          if (set.length === 0) {
            return { put: [], set: [] };
          }
          return { put, set };
        },
      };
  }
};

export function initPiece(cross: boolean, size: number): [Piece, number, number][] {
  let center = Math.floor((size - 1) / 2);
  if (cross) {
    return [
      [Piece.First, center, center],
      [Piece.First, center + 1, center + 1],
      [Piece.Second, center, center + 1],
      [Piece.Second, center + 1, center],
    ];
  } else {
    return [
      [Piece.First, center, center],
      [Piece.Second, center + 1, center + 1],
      [Piece.First, center, center + 1],
      [Piece.Second, center + 1, center],
    ];
  }
}
export const Osero: Config = {
  boardSize: 6,
  rule: createRule("_OSERO"),
  initPiece: initPiece(true, 6),
};
export type Action = {
  pos: [number, number];
  posTo?: [number, number];
  first: boolean;
  pass: boolean;
};

export type Event = {
  type: "played";
  action: Action;
  board: View;
  winner: Piece;
};

export type View = {
  current: Piece;
  board: Piece[][];
  rule: Rule;
  scores: [number, number];
  result: Piece;
  playable: Action[];
};

export class State {
  config: Config;
  record: Action[];
  first: boolean;
  board: Piece[][];
  rule: ruleAgent;

  constructor(config: Config) {
    this.config = config;
    this.record = [];
    this.first = true;
    this.board = Array.from(Array(config.boardSize)).map(() =>
      Array(config.boardSize).fill(Piece.Blank)
    );
    config.initPiece.forEach(([piece, y, x]) => {
      this.board[y][x] = piece;
    });
    this.rule = ruleToAgent(config.rule);
  }
  playable(): Action[] {
    const actions = this.playableBy(this.first);
    if (actions.length === 0) {
      const others = this.playableBy(!this.first);
      if (others.length === 0) {
        return [];
      }
      actions.push({ pos: null, first: this.first, pass: true });
    }
    return actions;
  }
  play(act: Action): Event {
    this.record.push(act);
    if (act.pass) {
      this.first = !this.first;
      return {
        type: "played",
        action: act,
        board: this.view(),
        winner: this.winner(),
      };
    }
    const { put, set } = this.checkReverse(act);
    console.log({put, set, rule: this.config.rule})
    put.forEach(([y, x, p]) => {
      this.board[y][x] = p;
    });
    set.forEach(([y, x]) => {
      this.board[y][x] =
        this.board[y][x] === Piece.Second ? Piece.First : Piece.Second;
    });
    this.first = !this.first;
    return {
      type: "played",
      action: act,
      board: this.view(),
      winner: this.winner(),
    };
  }
  end(): boolean {
    return (
      this.playableBy(this.first).length === 0 &&
      this.playableBy(!this.first).length === 0
    );
  }
  view(): View {
    return {
      current: this.first ? Piece.First : Piece.Second,
      board: this.board,
      rule: this.config.rule,
      scores: this.scores(),
      result: this.winner(),
      playable: this.playable(),
    };
  }
  scores(): [number, number] {
    const first = this.board.reduce((acc, row) => {
      return acc + row.filter((p) => p === Piece.First).length;
    }, 0);

    const second = this.board.reduce((acc, row) => {
      return acc + row.filter((p) => p === Piece.Second).length;
    }, 0);
    return [first, second];
  }

  winner(): Piece {
    if (!this.end()) {
      return Piece.Blank;
    }
    const [first, second] = this.scores();

    if (first > second) {
      return Piece.First;
    } else if (first < second) {
      return Piece.Second;
    } else {
      return Piece.Draw;
    }
  }
  playableBy(first: boolean): Action[] {
    const actions: Action[] = [];
    this.board.forEach((row, y) => {
      row.forEach((piece, x) => {
        if (
          piece === Piece.Blank &&
          this.checkReverse({ pos: [y, x], first: first, pass: false }).put
            .length > 0
        ) {
          actions.push({ pos: [y, x], first: first, pass: false });
        }
      });
    });
    return actions;
  }
  checkReverse(act: Action): {
    put: [number, number, Piece][];
    set: [number, number][];
  } {
    if (this.rule.puts === 1) {
      return this.rule.playBy(
        this.board,
        this.config.boardSize,
        act.pos,
        act.first
      );
    }
    return this.rule.playBy(
      this.board,
      this.config.boardSize,
      [act.pos, act.posTo],
      act.first
    );
  }
  boardStr(): string {
    return this.board
      .map((row) =>
        row
          .map((p) => (p === Piece.Blank ? "." : p === Piece.First ? "O" : "X"))
          .join("")
      )
      .join("\n");
  }
}

export type Agent = {
  name: string;
  action: (state: State) => Action;
} | null;

export class Game {
  state: State;
  bots: [Agent, Agent];
  constructor(state: State, bots: [Agent, Agent] = [null, null]) {
    this.state = state;
    this.bots = bots;
    if (bots[0] != null) {
      let action = this.bots[0].action(this.state);
      this.state.play(action);
    }
  }
  play(action: Action) {
    this.state.play(action);
    if (this.state.end()) return;
    if (this.state.first && this.bots[0] != null) {
      let action = this.bots[0].action(this.state);
      this.state.play(action);
    } else if (!this.state.first && this.bots[1] != null) {
      let action = this.bots[1].action(this.state);
      this.state.play(action);
    }
  }
}

export const RandomAgent = {
  name: "random",
  action(state: State): Action {
    const playable = state.playable();
    if (playable.length === 0) return null;
    const i = 0 | (Math.random() * playable.length);
    return playable[i];
  },
};
