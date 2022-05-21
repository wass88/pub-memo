import { Config, State, Piece } from "../ticktacktoe";

test("init", () => {
  expect(new State(new Config(2)).config.rank).toBe(2);
});

test("board", () => {
  const state = new State(new Config(2));
  const board = state.board;
  expect(board.length).toBe(81);
});

test("bfs", () => {
  const state = new State(new Config(2));
  expect(state.boardNumber(9)).toBe(null);
  expect(state.boardNumber(10)).toBe(0);
  expect(state.boardNumber(11)).toBe(1);
  expect(state.boardNumber(90)).toBe(80);
  const bfs = state.bfs(0);
  expect(bfs.type).toBe("node");
  expect(bfs.result).toBe(Piece.Blank);
  if (bfs.type == "node") {
    expect(bfs.board[0].type).toBe("node");
    if (bfs.board[0].type == "node") {
      expect(bfs.board[0].board[0].type).toBe("leaf");
    } else {
      fail("unexpected");
    }
  }
});
