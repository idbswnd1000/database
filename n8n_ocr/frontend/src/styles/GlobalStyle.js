import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    min-width: 320px;
    min-height: 100%;
    margin: 0;
  }

  body {
    min-height: 100vh;
    background: #f4f7fb;
    color: #172033;
    font-family:
      Pretendard,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    border: 0;
    cursor: pointer;
  }

  img {
    display: block;
    max-width: 100%;
  }
`;

export default GlobalStyle;