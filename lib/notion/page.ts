import { BlogPage, IDString } from "../memo-types";

export type NotionBody = {
  body: NotionBlock[];
};
export type NotionData = {
  id: IDString;
  title: string;
  summary: string;
  body: NotionBody;
  tags: string[];
};

export function notion2Blog(data): BlogPage {}

export async function fetchNotion(): NotionData[] {}
