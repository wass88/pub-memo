import { rmSync } from "fs";

export class Config {
    rank: number;
    constructor(rank: number) {
        this.rank = rank;
    }
}
export type Action = {
    pos: number[];
    first: boolean;
}

const AtomSize = 9;
export class State {
    config: Config;
    record: Action[];
    first: boolean;
    board: number[];
    lastMoves: number[];
    // x * 9 + 1 ~ x * 9 + 9
    //0: 0
    //1: 1     2   ~  9
    //2: 10-18 19-
    //3:

    constructor(config: Config) {
        this.config = config;
        this.record = [];
        this.first = true;
        const length = Math.pow(9, config.rank)
        this.board = Array(length).fill(0)
    }
    playable(): number[]{
        
    }
    bfs(node: number, r: number): {winner: number, playable: boolean} [] {
        if (this.pos(node)[]) {

        }
    }
    isLeaf(node:number): boolean {
        return pos[pos.length - 1]
    }
    pos(node: number) : number[] {
        const res = [];
        if (node === 0) {
            return res.reverse();
        }
        res.push((node - 1) % 9);
        node = (node - 1) / 9;
    }
}