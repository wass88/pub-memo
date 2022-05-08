import React from "react";

export type IDString = `${number}-${number}-${number}-${string}`;

export type BlogPage = {
  id: IDString;
  title: string;
  summary: string;
  body: React.FC;
  tags: string[];
};
