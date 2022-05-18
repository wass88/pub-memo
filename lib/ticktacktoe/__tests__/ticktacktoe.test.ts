import {Config, State} from "../ticktacktoe"


test("init", ()=>{
    expect(new State(new Config(2)).config.rank).toBe(2)
})

test("board", ()=>{
    const state = new State(new Config(2));
    const board = state.board;
    expect(board.length).toBe(9);
})

test("all", ()=>{
    const state = new State(new Config(2));
    const playable = state.playable();
    expect(playable.length).toBe(9);
})