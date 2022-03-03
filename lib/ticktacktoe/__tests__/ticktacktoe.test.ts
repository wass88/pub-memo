import {State} from "../ticktacktoe"


test("init", ()=>{
    expect(new State(2).rank).toBe(2)
})

test("board", ()=>{
    const state = new State(1);
    const board = state.board();
    expect(board.board.length).toBe(9);
})

test("all", ()=>{
    const state = new State(1);
    const board = state.playable();
    expect(playable.length).toBe(9);
})