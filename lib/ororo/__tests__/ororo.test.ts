import { State, Piece, Osero } from "../ororo";

test("init", () => {
  expect(new State(Osero).config.boardSize).toBe(6);
  expect(new State(Osero).board.length).toBe(6);
  expect(new State(Osero).board[0].length).toBe(6);
  expect(new State(Osero).board[2][3]).toBe(Piece.Second);
});

test("playable", () => {
  // 1 2 3
  // . . . 1
  // . O X 2
  // . X O 3
  const state = new State(Osero);
  expect(state.playable().length).toBe(4);
  state.play(state.playable()[0]);
  expect(state.playable().length).toBe(3);
  state.play(state.playable()[0]);
  expect(state.playable().length).toBe(5);
});

test("rand play", () => {
  const state = new State(Osero);
  const actions = state.playable();
  expect(state.play(actions[0]).winner).toBe(Piece.Blank);
  let i = 0;

  while (!state.end() && i < 62) {
    const actions = state.playable();
    state.play(actions[0]);
    i++;
  }
  expect(state.end()).toBe(true);
});
