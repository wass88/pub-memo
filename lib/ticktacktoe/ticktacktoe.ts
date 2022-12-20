export type Config = {
  rank: number;
};
export type Action = {
  pos: number[];
  first: boolean;
};

const AtomSize = 9;
export const Piece = {
  First: 1,
  Second: 2,
  Blank: 0,
  Draw: 3,
};
export type Piece = typeof Piece[keyof typeof Piece];

export type Event = {
  type: "played";
  action: Action;
  board: View;
  diff: { pos: number[]; piece: Piece }[];
  winner: Piece;
};

const RowOrder = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export type View = (BfsLeaf & { playable: boolean }) | BfsNode;

type Bfs = BfsLeaf | BfsNode;

type BfsLeaf = {
  type: "leaf";
  result: Piece;
  board_pos: number;
  pos: number[];
};
type BfsNode = {
  type: "node";
  result: Piece;
  board: View[];
  pos: number[];
};

export class State {
  config: Config;
  record: Action[];
  first: boolean;
  board: Piece[];
  // x * 9 + 1 ~ x * 9 + 9
  //-: 0
  //1: 1     2   ~  9
  //2: 10-18 19-    82-90
  //3:

  constructor(config: Config) {
    this.config = config;
    this.record = [];
    this.first = true;
    const length = Math.pow(9, config.rank);
    this.board = Array(length).fill(0);
  }
  bfs(node: number = 0, pos: number[] = []): Bfs {
    function winner(atomBoard: Piece[]): Piece {
      if (atomBoard.length !== AtomSize) {
        throw new Error(`atomBoard length !== ${AtomSize}. ${atomBoard}`);
      }
      for (let r of RowOrder) {
        if (r.every((x) => atomBoard[x] === Piece.First)) {
          return Piece.First;
        }
        if (r.every((x) => atomBoard[x] === Piece.Second)) {
          return Piece.Second;
        }
      }
      if (atomBoard.some((x) => x === Piece.Blank)) {
        return Piece.Blank;
      }
      return Piece.Draw;
    }
    const boardNumber = this.boardNumber(node);
    if (boardNumber !== null) {
      return {
        type: "leaf",
        result: this.board[boardNumber],
        board_pos: boardNumber,
        pos: pos,
      };
    }
    const child = node * AtomSize + 1;
    const results = [];
    for (let st = 0; st < AtomSize; st++) {
      results.push(this.bfs(child + st, pos.concat([st])));
    }
    const atomBoard = results.map((r) => r.result);
    const atomResult = winner(atomBoard);
    return {
      type: "node",
      result: atomResult,
      board: results,
      pos: pos,
    };
  }
  boardNumber(node: number): number | null {
    const pos = this.pos(node);
    if (pos.length > this.config.rank) {
      throw new Error(`node is too large: ${node} -> ${pos}`);
    }
    if (pos.length === this.config.rank) {
      return pos.reduce((a, x) => a * 9 + x);
    }
    return null;
  }
  pos(node: number): number[] {
    const res = [];
    while (node > 0) {
      res.push((node - 1) % 9);
      node = 0 | ((node - 1) / 9);
    }
    return res.reverse();
  }
  view(): View {
    const p = (node: Bfs, playable: boolean): View => {
      if (node.type === "leaf") {
        return { ...node, playable: playable && node.result === Piece.Blank };
      }
      return {
        ...node,
        board: node.board.map((b) =>
          p(b, playable && node.result == Piece.Blank)
        ),
      };
    };
    const playable = p(this.bfs(), true);
    const limited = this.limit(playable);
    return limited;
  }
  pos2board(pos: number[]): number {
    const bfs = this.bfs();
    const leaf = pos.reduce((b, p) => {
      if (b.type !== "node") {
        throw new Error(`${pos} is too deep at ${b}`);
      }
      return b.board[p];
    }, bfs);
    if (leaf.type !== "leaf") {
      throw new Error(`${pos} is too shallow`);
    }
    return leaf.board_pos;
  }
  limit(view: View): View {
    if (this.record.length === 0) {
      return view;
    }
    const last = this.record[this.record.length - 1];
    // TODO: backward game
    function validPos(pos: number[]): boolean {
      for (let i = 1; i < last.pos.length; i++) {
        if (last.pos[i] !== pos[i - 1]) return false;
      }
      return true;
    }
    function collect(v: View): [number[][], View] {
      if (v.type === "leaf") {
        if (v.playable && validPos(v.pos)) return [[v.pos], v];
        return [[], { ...v, playable: false }];
      }
      const [playable, limited] = v.board.reduce(
        ([ap, an], b) => {
          const [playable, limited] = collect(b);
          return [ap.concat(playable), an.concat(limited)];
        },
        [[], []]
      );
      return [playable, { ...v, board: limited }];
    }
    const [playable, limited] = collect(view);
    if (playable.length === 0) {
      return view;
    }
    return limited;
  }
  playable(): Action[] {
    const collect = (v: View) => {
      if (v.type === "leaf") {
        if (v.playable) return [{ pos: v.pos, first: this.first }];
        return [];
      }
      return v.board.flatMap(collect);
    };
    return collect(this.view());
  }
  play(act: Action): Event {
    const { pos, first } = act;
    if (this.first !== first) {
      throw new Error(`current player is ${first ? "first" : "second"}`);
    }
    const leaf = pos.reduce((v, p) => {
      if (v.type !== "node") {
        throw new Error(`pos: ${pos} is deep`);
      }
      return v.board[p];
    }, this.view());
    if (leaf.type !== "leaf") {
      throw new Error(`pos: ${pos} is shallow`);
    }
    if (!leaf.playable) {
      throw new Error(`pos: ${pos} is not playable`);
    }
    const board_pos = this.pos2board(pos);
    if (this.board[board_pos] !== Piece.Blank) {
      throw new Error(`the position is already placed ${pos}`);
    }
    const old_bfs = this.view();
    this.board[board_pos] = first ? Piece.First : Piece.Second;
    this.first = !this.first;
    const view = this.view();
    const diff = [];
    this.record.push(act);

    return {
      type: "played",
      action: act,
      board: view,
      diff: diff,
      winner: view.result,
    };
  }
  end(): boolean {
    return this.bfs().result !== Piece.Blank;
  }
  clone(): State {
    const state = new State(this.config);
    state.board = this.board.map((s) => s);
    state.first = this.first;
    state.record = this.record.map((s) => s);
    return state;
  }
}

export type Agent = {
  name: string;
  action: (state: State) => Action;
} | null;

export const RandomAgent = {
  name: "random",
  action(state: State): Action {
    const playable = state.playable();
    if (playable.length === 0) return null;
    const i = 0 | (Math.random() * playable.length);
    return playable[i];
  },
};

export const MinMovesAgent = {
  name: "random",
  action(state: State): Action {
    const playable = state.playable();
    if (playable.length > 81) {
      return RandomAgent.action(state);
    }
    if (playable.length === 0) return null;
    const mins = playable.map<[Action, number]>((a) => {
      const s = state.clone();
      s.play(a);
      if (s.end()) {
        return [a, 0];
      }
      return [a, s.playable().length];
    });
    console.log(mins);
    mins.sort(([_a, a], [_b, b]) => a - b);
    const min = mins.filter(([_, n]) => n === mins[0][1]);
    return mins[0 | (Math.random() * min.length)][0];
  },
};

export function pieceOf(first: boolean): Piece {
  return first ? Piece.First : Piece.Second;
}

export const MinOpoAgent = {
  name: "random",
  action(state: State): Action {
    const playable = state.playable();
    if (playable.length === 0) return null;
    if (playable.length > 81) {
      return RandomAgent.action(state);
    }
    const mins = playable.map<[Action, number]>((a) => {
      const s = state.clone();
      s.play(a);
      if (s.end()) {
        return [a, 0];
      }
      const view = s.view();

      const playable = s.playable();
      if (playable.length > 9) {
        return [a, 10];
      }
      const leaf = playable[0].pos
        .slice(0, playable[0].pos.length - 1)
        .reduce((v, p) => (v as BfsNode).board[p], view) as BfsNode;
      const ops = leaf.board.filter((b) => b.result === pieceOf(s.first));
      return [a, ops.length];
    });
    mins.sort(([_a, a], [_b, b]) => a - b);
    const min = mins.filter(([_, n]) => n === mins[0][1]);
    return mins[0 | (Math.random() * min.length)][0];
  },
};

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
