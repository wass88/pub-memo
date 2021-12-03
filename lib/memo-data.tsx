import { BlogPage } from "./memo-types";

export class Memos {
  memos: BlogPage[];
  constructor() {
    this.memos = [];
  }
  add(b: BlogPage) {
    this.memos.push(b);
  }
  get(id: string): BlogPage {
    return this.memos.find((b) => b.id === id);
  }
  getByTag(tag): BlogPage[] {
    return this.memos.filter((b) => b.tags.indexOf(tag) >= 0);
  }
  tags(): string[] {
    return Array.from(new Set(this.memos.flatMap((b) => b.tags))).sort();
  }
}

const memos = new Memos();
export default memos;
