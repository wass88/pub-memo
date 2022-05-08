import { BlogPage, IDString } from "./memo-types";

export class Memos {
  memos: Map<IDString, BlogPage>;
  constructor() {
    this.memos = new Map();
  }
  add(b: BlogPage) {
    this.memos.set(b.id, b);
  }
  get(id: IDString): BlogPage {
    return this.memos.get(id);
  }
  getByTag(tag): BlogPage[] {
    return this.getAll().filter((b) => b.tags.indexOf(tag) >= 0);
  }
  tags(): string[] {
    return Array.from(new Set(this.getAll().flatMap((b) => b.tags))).sort();
  }
  getAll(): BlogPage[] {
    return Array.from(this.memos.values()).sort((a, b) =>
      a.id < b.id ? -1 : a.id > b.id ? 1 : 0
    );
  }
}

const memos = new Memos();
export default memos;
