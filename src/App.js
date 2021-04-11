import React, { Component } from "react";
import localforage from "localforage";
import { createGlobalStyle } from "styled-components";
import FileReaderInput from "react-file-reader-input";
import { ReactReader } from "./modules";
import {
  Container,
  ReaderContainer,
  Bar,
  GenericButton,
  ButtonWrapper
} from "./Components";

const storage = global.localStorage || null;

const DEMO_URL = "/files/Dostoevskiyi_F._Spisokshkolnoy._Prestuplenie_I_Nakazanie.epub";
const DEMO_NAME = "Dostoevskiyi_F._Spisokshkolnoy._Prestuplenie_I_Nakazanie";

const GlobalStyle = createGlobalStyle`
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
`;
let apiprocread_cache = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
      localFile: apiprocread_cache || null,
      localName: null,
      location:
        storage && storage.getItem("epub-location")
          ? storage.getItem("epub-location")
          : 2,
      largeText: false,
      parentPage: false
    };
    this.rendition = null;
  }

  componentDidMount() {
    localforage.getItem('apiprocread_cache').then((value) => {
      this.setState({localFile: value});
    }).catch(function(err) {
    });
    localforage.getItem('apiprocread_cache2').then((value) => {
      this.setState({localFile2: value});
    }).catch(function(err) {
    });
  }

  onLocationChanged = location => {
    this.setState(
      {
        location
      },
      () => {
        storage && storage.setItem("epub-location", location);
      }
    );
  };

  getRendition = rendition => {
    const { largeText } = this.state;
    this.rendition = rendition;
    rendition.themes.fontSize(largeText ? "140%" : "100%");
  };

  handleChangeFile = async (event, results) => {
    if (results.length > 0) {
      const [e, file] = results[0];
      if (file.type !== "application/epub+zip") {
        return alert("Unsupported type");
      }
      const localFile = e.target.result
      await localforage.setItem('apiprocread_cache', localFile).then(function (value) {
      }).catch(function(err) {
      });
      this.setState({
        localFile: localFile,
        localName: file.name,
        location: null
      });
    }
  };

  triggerPage = (page)  => {
    this.setState({parentPage: page})
  }

  render() {
    const {
      fullscreen,
      location,
      localFile,
      localName,
    } = this.state;
    return (
      <Container>
        <GlobalStyle />
        <Bar>
          <ButtonWrapper className="btns">
            <FileReaderInput as="buffer" onChange={this.handleChangeFile}>
              <GenericButton className="title">Upload epub</GenericButton>
            </FileReaderInput>
            <div className="title">{localName || DEMO_NAME}</div>
          </ButtonWrapper>
        </Bar>
        <ReaderContainer fullscreen={fullscreen}>
          <ReactReader
            className="firstLayer"
            triggerPage={this.triggerPage}
            url={localFile || DEMO_URL}
            title=""
            location={location}
            locationChanged={this.onLocationChanged}
            getRendition={this.getRendition}
          />
        </ReaderContainer>
      </Container>
    );
  }
}

export default App;
