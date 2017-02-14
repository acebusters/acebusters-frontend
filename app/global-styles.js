import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`

  html {
    height: 100%;
    width: 100%;
    font-family: sans-serif;
    font-size: 10px;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }

  body {
    height: 100%;
    width: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: block;
    margin: 0;
    line-height: 1.42857143;
    color: #333;
    background-color: #fff;
    font-family: 'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif;
    font-weight: 400;
    font-size: 14px;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body:after, body:before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  * {
    box-sizing: border-box;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
`;
