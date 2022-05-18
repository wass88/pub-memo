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

export class State {
    config: Config;
    record: Action[];
    first: boolean;
    board: number[];
    lastMoves: number[];
    // x -> 9x - 9x+8
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
        if (this.isLeaf(node)) {

        }
    }
    isLeaf(node: number) {
        Math.pow(9, config.rank)
    }
}