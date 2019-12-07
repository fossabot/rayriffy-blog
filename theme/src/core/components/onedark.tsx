import { css, Global } from '@emotion/core'
import React from 'react'

const OneDarkPrism: React.FC = () => {
  return (
    <Global
      styles={css`
        code[class*='language-'],
        pre[class*='language-'] {
          color: #f8f8f2;
          background: none;
          text-shadow: 0 1px rgba(0, 0, 0, 0.3);
          font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
          text-align: left;
          white-space: pre;
          word-spacing: normal;
          word-break: normal;
          word-wrap: normal;
          line-height: 1.5;
          -moz-tab-size: 4;
          -o-tab-size: 4;
          tab-size: 4;
          -webkit-hyphens: none;
          -moz-hyphens: none;
          -ms-hyphens: none;
          hyphens: none;
        }

        /* Code blocks */
        pre[class*='language-'] {
          padding: 20px;
          margin: 0.5em 0;
          overflow: auto;
          border-radius: 0.3em;
        }

        :not(pre) > code[class*='language-'],
        pre[class*='language-'] {
          background: #282a36;
        }

        /* Inline code */
        :not(pre) > code[class*='language-'] {
          padding: 0.1em;
          border-radius: 0.3em;
          white-space: normal;
        }

        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
          color: #6272a4;
        }

        .token.punctuation {
          color: #f8f8f2;
        }

        .namespace {
          opacity: 0.7;
        }

        .token.property,
        .token.tag,
        .token.constant,
        .token.symbol,
        .token.deleted {
          color: #ff79c6;
        }

        .token.boolean,
        .token.number {
          color: #bd93f9;
        }

        .token.selector,
        .token.attr-name,
        .token.string,
        .token.char,
        .token.builtin,
        .token.inserted {
          color: #50fa7b;
        }

        .token.operator,
        .token.entity,
        .token.url,
        .language-css .token.string,
        .style .token.string,
        .token.variable {
          color: #f8f8f2;
        }

        .token.atrule,
        .token.attr-value,
        .token.function,
        .token.class-name {
          color: #f1fa8c;
        }

        .token.keyword {
          color: #8be9fd;
        }

        .token.regex,
        .token.important {
          color: #ffb86c;
        }

        .token.important,
        .token.bold {
          font-weight: bold;
        }

        .token.italic {
          font-style: italic;
        }

        .token.entity {
          cursor: help;
        }
      `}
    />
  )
}

export default OneDarkPrism
