import { BlogPage, IDString } from "./memo-types";
import { fetchNotion } from "./notion/page";
import { NotionPage, blogFromNotion } from "./notion/notion-page";

export class Memos {
  memos: Map<IDString, BlogPage>;
  notions: Map<IDString, NotionPage>;
  constructor() {
    this.memos = new Map();
  }
  add(b: BlogPage) {
    this.memos.set(b.id, b);
  }
  get(id: IDString): BlogPage {
    return this.memos.get(id) || blogFromNotion(this.notions.get(id));
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
      .sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
  }
  async fetchNotion(): Promise<NotionPage[]> {
    return fetchNotion();
  }
  addNotion(pages: NotionPage[]) {
    this.notions = new Map();
    pages.forEach((page) => this.notions.set(page.id, page));
  }
  getNotionPage(id: IDString): BlogPage {
    const data = this.notions.get(id);
    return data ? blogFromNotion(data) : null;
  }
  getAllNotionPage(): BlogPage[] {
    return Array.from(this.notions.values()).map((data) =>
      blogFromNotion(data)
    );
  }
}

const memos = new Memos();
export default memos;
