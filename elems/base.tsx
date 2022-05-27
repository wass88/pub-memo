import React, { useState } from "react";
import css from "styled-jsx/css";

export function Tips(props) {
  return <div className="tips">{props.children}</div>;
}

export function Img(props: { src: any; alt: string }) {
  return <img src={props.src} alt={props.alt} className="blog-image"></img>;
}

export function Btn(props) {
  const touch = () =>
    window.ontouchstart !== null && navigator.maxTouchPoints > 0;
  const [pushed, setPushed] = useState(() => false);

  const style = css`
    button {
      background: var(--main-color);
      color: var(--fg-color);
      font-weight: bold;
      text-shadow: 1px 1px var(--sub-dark-color);
      font-size: 16px;
      padding: 4px 8px;
      border-radius: 20px;
      border: 1px solid var(--sub-dark-color);
      box-shadow: 1px 1px var(--sub-dark-color), 2px 2px var(--sub-dark-color),
        3px 3px var(--sub-dark-color);
      cursor: pointer;
    }
    button:hover:not(:disabled) {
      box-shadow: 1px 1px var(--sub-dark-color), 2px 2px var(--sub-dark-color);
      transform: translate(1px, 1px);
    }
    button.pushed {
      box-shadow: none;
      transform: translate(3px, 3px);
    }
    button:disabled {
      filter: grayscale(80%);
    }
  `;
  const disabledBtn = (
    <button disabled>
      {props.children} <style jsx>{style}</style>
    </button>
  );
  const btn = (
    <button
      disabled={props.disabled}
      onClick={(e) => {
        if (!touch()) props.onClick(e);
      }}
      onMouseDown={(e) => {
        setPushed(true);
      }}
      onMouseLeave={(e) => {
        setPushed(false);
      }}
      onMouseUp={(e) => {
        setPushed(false);
      }}
      onTouchStart={(e) => {
        setPushed(true);
      }}
      onTouchEnd={(e) => {
        if (pushed) {
          props.onClick(e);
        }
        setPushed(false);
      }}
      className={`${pushed ? "pushed" : ""}`}
    >
      {props.children} <style jsx>{style}</style>
    </button>
  );
  return props.disabled ? disabledBtn : btn;
}
