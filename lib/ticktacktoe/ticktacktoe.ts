export class Config {
  rank: number;
  constructor(rank: number) {
    this.rank = rank;
  }
}
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
type Piece = typeof Piece[keyof typeof Piece];

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

type BfsResult =
  | {
      type: "leaf";
      result: Piece;
      board_pos: number;
    }
  | {
      type: "node";
      result: Piece;
      board: BfsResult[];
    };
export class State {
  config: Config;
  record: Action[];
  first: boolean;
  board: Piece[];
  lastMoves: number[];
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
  bfs(node: number): BfsResult {
    function winner(atomBoard: Piece[]): Piece {
      if (atomBoard.length !== AtomSize) {
        throw new Error(`atomBoard length !== ${AtomSize}. ${atomBoard}`);
      }
      RowOrder.forEach((r) => {
        if (r.every((x) => atomBoard[x] === Piece.First)) {
          return Piece.First;
        }
        if (r.every((x) => atomBoard[x] === Piece.Second)) {
          return Piece.Second;
        }
      });
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
      };
    }
    const child = node * AtomSize + 1;
    const results = [];
    for (let st = 0; st < AtomSize; st++) {
      results.push(this.bfs(child + st));
    }
    const atomBoard = results.map((r) => r.result);
    const atomResult = winner(atomBoard);
    return {
      type: "node",
      result: atomResult,
      board: results,
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
}
