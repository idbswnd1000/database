import {
    createGlobalStyle,
} from "styled-components";

const GlobalStyle =
    createGlobalStyle`
    * {
      box-sizing: border-box;
    }

    html,
    body,
    #root {
      min-height: 100%;
      margin: 0;
    }

    body {
      font-family:
        Inter,
        Pretendard,
        Arial,
        sans-serif;
      color: #0f172a;
    }

    button,
    input,
    textarea {
      font: inherit;
    }
  `;

export default GlobalStyle;