export type Action = {
    pos: number[];
    first: boolean;
}

export class State {
    rank: number;
    record: Action[];
    first: boolean;
    board: number[];
    lastMoves: number[];
    constructor(rank: number) {
        this.rank = rank;
        this.record = [];
        this.first = true;
        const length = Math.pow(9, rank)
        this.board = Array(length).fill(0)
    }
    playable(): number[]{

    }
    bfs(node: number, r: number): {winner: number, playable: boolean} [] {
        if (this.isLeaf(node)) {

        }
    }
}