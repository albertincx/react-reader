import {createGlobalStyle} from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
    padding: 0;
    color: inherit;
    font-size: inherit;
    font-weight: 300;
    line-height: 1.4;
    word-break: break-word;
  }
  html {
    font-size: 62.5%;
  }
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-size: 1.8rem;
    background: #333;
    position: absolute;
    height: 100%;
    width: 100%;
    color: #fff;
  }
  #tran-a {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
  }
  #translateLayer-border {
  position: absolute;
  border: 27px solid #777;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  }
  #translateLayer {
  font-size: 16px;
    position: absolute;
    top: 0;
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    -webkit-transition: all 0.6s ease;
    transition: all 0.6s ease;
    0 0 5px rgba(0,0,0,.3): ;
    opacity: 0;
    margin: 27px 17px;
  }
  a#tran-a {text-decoration: none;}
  #translateLayer {opacity: 0; }
  #translateLayer div div {
  z-index: 0 !important;
   }
  #translateLayer.show {opacity: 1;}
  #tran-a.show {
  z-index: 1 !important;
  }
  #translateLayer button {
  z-index: 1;
  display:none;
  }
  #translateLayer.show button {
  z-index: 3
  }
  .firstLayer button {
    z-index: 2;
  }
  .firstLayer button:last-child {
    z-index: 2;
  }
  .btns {
    display: flex;
    justify-content: space-between !important;
  }
  .title {
    font-size: 1.1rem;
    text-align: center;
    color: rgb(153, 153, 153);
  }
  .firstLayer button {
  }
  button.second-btn {
    margin-top: -105px  !important;
  }
  .second-btn.left {
  
  }
`;