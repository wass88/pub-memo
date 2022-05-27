import React, { useState } from "react";
import { useEffect } from "react";
import css from "styled-jsx/css";

export function Tips(props) {
  return <div className="tips">{props.children}</div>;
}

export function Img(props: { src: any; alt: string; block?: boolean }) {
  const styles = css`
    img.block {
      display: block;
      margin: 0 auto 1rem auto;
      max-width: 100%;
    }
    img {
      transition: opacity 1s;
    }
    img.hide {
      opacity: 0.1;
    }
  `;
  const trace = props.src.trace != null;
  const [src, setSrc] = useState(trace ? props.src.trace : props.src);
  const [hide, setHide] = useState(true);
  useEffect(() => {
    if (!trace) return;
    const img = new Image();
    img.src = props.src.src;
    img.onload = () => {
      setSrc(props.src.src);
      setHide(false);
    };
  }, [props.src, trace]);
  return (
    <>
      <img
        src={src}
        alt={props.alt}
        className={`blog-image ${hide ? "hide" : ""} ${
          props.block ? "block" : ""
        }`}
      ></img>
      <style jsx>{styles}</style>
    </>
  );
}

export function Btn(props) {
  const touch = () =>
    window.ontouchstart !== null && navigator.maxTouchPoints > 0;
  const [pushed, setPushed] = useState(() => false);

  const styles = css`
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
    button.pushed:not(:disabled) {
      box-shadow: none;
      transform: translate(3px, 3px);
    }
    button:disabled {
      filter: grayscale(80%);
    }
  `;
  const disabledBtn = (
    <button disabled>
      {props.children} <style jsx>{styles}</style>
    </button>
  );
  const btn = (
    <button
      disabled={props.disabled}
      onClick={(e) => {
        if (!touch()) {
          props.onClick(e);
        }
      }}
      onMouseDown={(e) => {
        setPushed(true);
      }}
      onMouseOut={(e) => {
        setPushed(false);
      }}
      onMouseUp={(e) => {
        setPushed(false);
      }}
      onTouchStart={(e) => {
        setPushed(true);
      }}
      onTouchEnd={(e) => {
        if (pushed && touch()) {
          props.onClick(e);
        }
        setPushed(false);
      }}
      className={`${pushed ? "pushed" : ""}`}
    >
      {props.children} <style jsx>{styles}</style>
    </button>
  );
  return props.disabled ? disabledBtn : btn;
}

export function A(props: { href: string; children: any }) {
  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer">
      {props.children}
      <style jsx>
        {`
          a {
            color: var(--main-fg-color);
            text-shadow: 1px 1px var(--main-color);
          }
          a:hover {
            text-shadow: 1px 1px var(--main-color), -1px -1px var(--main-color);
          }
        `}
      </style>
    </a>
  );
}
