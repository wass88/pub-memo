import React, { useReducer } from "react";
import Image from "next/image";

export function Tips(props) {
  return <div className="tips">{props.children}</div>;
}

export function Img(props: { src: any; alt: string }) {
  return <Image src={props.src} alt={props.alt} className="blog-image"></Image>;
}
