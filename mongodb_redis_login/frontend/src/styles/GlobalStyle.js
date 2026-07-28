import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f7f9fc;
        color: #1e293b;
    }

    button,
    input {
        font: inherit;
    }

    button {
        border: none;
    }
`;

export default GlobalStyle;