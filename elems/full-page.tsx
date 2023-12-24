import Head from "next/head";

export function IconEmoji({ emoji }: { emoji: string }) {
  return (
    <Head>
      <link
        key="icon"
        rel="icon"
        href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${
          emoji || "✍"
        }</text></svg>`}
      ></link>
    </Head>
  );
}
export function Descriptions({
  title,
  description,
  emoji,
}: {
  title: string;
  description: string;
  emoji?: string;
}) {
  return (
    <>
      <Head>
        <title key="title">{title}</title>
        <meta key="description" name="description" content={description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@wass80" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://memo.wass80.xyz/icon.png" />
      </Head>
      <IconEmoji emoji={emoji}></IconEmoji>
    </>
  );
}
export default function FullPage({ children }) {
  return (
    <div className="container">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="format-detection"
          content="telephone=no,address=no,email=no"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>
      <Descriptions
        title="wassのメモ書き"
        description="wassのメモ書き一覧"
        emoji="✍"
      ></Descriptions>

      <div className="inner">
        <main>{children}</main>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          padding: 0;
          margin: 0;
        }
        :root {
          --main-color: #6eb488;
          --sub-light-color: #7ff0aa;
          --sub-darker-color: #3a6746;
          --sub-dark-color: #6eb488;
          --sub-lighter-color: #e8f4d9;

          --fg-color: var(--sub-lighter-color);

          --jump: 16px;
        }
        html {
          font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic Pro",
            "Yu Gothic Medium", YuGothic, "メイリオ", sans-serif;
          font-size: var(--jump);
          line-height: 2;
          color: var(--fg-color);
          background-color: #050505;
          background-image: linear-gradient(
              135deg,
              #001006 25%,
              transparent 25%
            ),
            linear-gradient(225deg, #001006 25%, transparent 25%),
            linear-gradient(45deg, #001006 25%, transparent 25%),
            linear-gradient(315deg, #001006 25%, #050505 25%);
          background-position: 10px 0, 10px 0, 0 0, 0 0;
          background-size: 20px 20px;
          background-repeat: repeat;
        }
        body {
          height: 100vh;
        }
        .container {
          padding-bottom: 16px;
        }
        h1 {
          font-size: 400%;
          line-height: 1.25;
          font-weight: bold;
          padding: calc(3 * var(--jump)) 0;
          --stripe-color: var(--sub-light-color);
          background-color: var(--main-color);
          background-image: linear-gradient(
            90deg,
            transparent 50%,
            var(--stripe-color) 50%
          );
          background-size: 3px 30px;
          background-clip: text;
          color: transparent;
          margin-top: -8px;
          margin-bottom: -36px;
        }
        h2 {
          font-size: 200%;
          margin-top: 10px;
          margin-bottom: 6px;
        }
        h3 {
          font-size: 150%;
          margin-top: 12px;
          margin-bottom: 4px;
        }
        .inner {
          max-width: 960px;
          margin: 0 auto;
        }
        p {
          margin-block-end: 1rem;
        }
        @media screen and (max-width: 960px) {
          .inner {
            padding: 0 16px;
          }
          h1 {
            font-size: 200%;
          }
        }
        a {
          text-decoration: inherit;
          color: inherit;
        }
        a:hover {
          color: inherit;
        }
        a:visited {
          color: inherit;
        }
        ul {
          padding-inline-start: 1rem;
          margin-block-end: 1rem;
        }
        ul > ul {
          margin-block-end: 0;
        }
        img {
          max-width: 640px;
        }
        figure > div {
          align-items: center;
        }
        .notion-row {
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}
