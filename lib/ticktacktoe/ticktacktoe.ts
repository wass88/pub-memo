export type Action = {
    pos: number[];
    first: boolean;
}

export class State {
    rank: number;
    record: Action[];
    board(): Board {
        return new Board(this.rank)
    }
    constructor(rank: number) {
        this.rank = rank;
        this.record = [];
    }
    playable(): number[]{

    }
}

export class Board {
    rank: number;
    first: boolean;
    board: number[];
    constructor(rank: number) {
        this.rank = rank;
        this.first = true;
        const length = Math.pow(9, rank)
        this.board = Array(length).fill(0)
    }
    playable(): number[] {
        
    }
    bfs(node: number, r: number): number[] {
        
    }
}