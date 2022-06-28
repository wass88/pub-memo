import { BlogPage, IDString } from "./memo-types";
import { NotionData, notionToBlog, fetchNotionPages } from "./notion/page";

export class Memos {
  memos: Map<IDString, BlogPage>;
  notions: Map<IDString, NotionData>;
  constructor() {
    this.memos = new Map();
  }
  async fetchNotion(): Promise<NotionData[]> {
    return fetchNotionPages;
  }
  addNotion(pages: NotionData[]) {
    pages.forEach((page) => this.notions.set(page.id, page));
  }
  getNotionPage(id): BlogPage {
    const data = this.notions.get(id);
    return data ? notionToBlog(data) : null;
  }
  getAllNotionPage(): BlogPage[] {
    return Array.from(this.notions.values()).map((data) => notionToBlog(data));
  }
  add(b: BlogPage) {
    this.memos.set(b.id, b);
  }
  get(id: IDString): BlogPage {
    return this.memos.get(id) || this.notions.get(id);
  }
  getByTag(tag): BlogPage[] {
    return this.getAll().filter((b) => b.tags.indexOf(tag) >= 0);
  }
  tags(): string[] {
    return Array.from(new Set(this.getAll().flatMap((b) => b.tags))).sort();
  }
  getAll(): BlogPage[] {
    return Array.from(this.memos.values())
      .concat(this.getAllNotionPage())
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  }
}

const memos = new Memos();
export default memos;
