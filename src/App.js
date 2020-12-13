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
import request from './api';
import { API_BOOKS } from './api/config';

const storage = global.localStorage || null;

const DEMO_URL = "/files/Dostoevskiyi_F._Spisokshkolnoy._Prestuplenie_I_Nakazanie.epub";
const DEMO_URL2 = "/files/Dostoevskiyi_F._Spisokshkolnoy._Prestuplenie_I_NakazanieENGLISH.epub";
const DEMO_NAME = "Dostoevskiyi_F._Spisokshkolnoy._Prestuplenie_I_Nakazanie";
const DEMO_NAME2 = "Dostoevskiyi_F._Spisokshkolnoy._Prestuplenie_I_NakazanieENGLISH";

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
    /* padding: 20px; */
    /* background: #565656; */
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
  .btns {



  }
  #translateLayer button {
  z-index: 1;
  display:none;
  }
  #translateLayer.show button {
  z-index: 3
  }
  .firstLayer button {
  z-index: 2
  }
`;
let apiprocread_cache = [];
let apiprocread_cache2 = [];

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

      location2:
        storage && storage.getItem("epub-location2")
          ? storage.getItem("epub-location2")
          : 2,
      localFile2: apiprocread_cache2 || null,
      localName2: null,
      largeText: false,
      largeText2: false,
      parentPage: false
    };
    this.rendition = null;
    this.rendition2 = null;
  }

  componentDidMount() {
    localforage.getItem('apiprocread_cache').then((value) => {
      // This code runs once the value has been loaded
      // from the offline store.
      this.setState({localFile: value});
    }).catch(function(err) {
      // This code runs if there were any errors
    });
    localforage.getItem('apiprocread_cache2').then((value) => {
      // This code runs once the value has been loaded
      // from the offline store.
      this.setState({localFile2: value});
    }).catch(function(err) {
      // This code runs if there were any errors
    });
  }

  toggleFullscreen = () => {
    this.setState(
      {
        fullscreen: !this.state.fullscreen
      },
      () => {
        setTimeout(() => {
          const evt = document.createEvent("UIEvents");
          evt.initUIEvent("resize", true, false, global, 0);
        }, 1000);
      }
    );
  };

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
  onLocationChanged2 = location => {

    this.setState(
      {
        location2: location
      },
      () => {
        storage && storage.setItem("epub-location2", location);
      }
    );
  };
  getRendition2 = rendition => {
    // Set inital font-size, and add a pointer to rendition for later updates
    const { largeText2 } = this.state;
    this.rendition2 = rendition;
    rendition.themes.fontSize(largeText2 ? "140%" : "100%");
  };
  getRendition = rendition => {
    // Set inital font-size, and add a pointer to rendition for later updates
    const { largeText } = this.state;
    this.rendition = rendition;
    rendition.themes.fontSize(largeText ? "140%" : "100%");
  };

  handleChangeFile = async (event, results) => {
    if (results.length > 0) {
      const [e, file] = results[0];
      // const fd = new FormData();
      // fd.append('file', file, 'blobby.txt');
      // await request(API_BOOKS, {formData : fd}).catch(console.log)
      if (file.type !== "application/epub+zip") {
        return alert("Unsupported type");
      }
      const localFile = e.target.result
      await localforage.setItem('apiprocread_cache', localFile).then(function (value) {
        // Do other things once the value has been saved.
      }).catch(function(err) {
        // This code runs if there were any errors
      });
      this.setState({
        localFile: localFile,
        localName: file.name,
        location: null
      });
    }
  };
  handleChangeFile2 = async (event, results) => {
    if (results.length > 0) {
      const [e, file] = results[0];
      if (file.type !== "application/epub+zip") {
        return alert("Unsupported type");
      }
      const localFile = e.target.result
      await localforage.setItem('apiprocread_cache2', localFile).then(function (value) {
        // Do other things once the value has been saved.
      }).catch(function(err) {
        // This code runs if there were any errors
      });
      this.setState({
        localFile2: localFile,
        localName2: file.name,
        location2: null
      });
    }
  };
  mouse = (e)  => {
    if(e.target.tagName === 'BUTTON' ||
      e.target.getAttribute('id') !== 'translateLayer-border'){
    } else {
      document.getElementById('translateLayer').classList.toggle( 'show')
      document.getElementById('tran-a').classList.toggle( 'show')
    }
  }
  triggerPage = (page)  => {
    this.setState({parentPage: page})
  }
  click = (e)  => {
    if(e.target.tagName === 'BUTTON' ||
      e.target.getAttribute('id') !== 'translateLayer-border'){
    } else {
      document.getElementById('translateLayer').classList.toggle( 'show')
      document.getElementById('tran-a').classList.toggle( 'show')
    }
  }
  render() {
    const {
      fullscreen,
      location,
      location2,
      localFile,
      localFile2,
      localName,
      localName2
    } = this.state;
    return (
      <Container>
        <GlobalStyle />
        <Bar>
          <ButtonWrapper className="btns">
            <FileReaderInput as="buffer" onChange={this.handleChangeFile}>
              <GenericButton>Upload epub</GenericButton>
            </FileReaderInput>
            <FileReaderInput as="buffer" onChange={this.handleChangeFile2}>
              <GenericButton>Upload Translated epub</GenericButton>
            </FileReaderInput>
          </ButtonWrapper>
        </Bar>
        <ReaderContainer fullscreen={fullscreen}>
          {true ? (
            <ReactReader
              className="firstLayer"
              triggerPage={this.triggerPage}
              url={localFile || DEMO_URL}
              title={localName || DEMO_NAME}
              location={location}
              locationChanged={this.onLocationChanged}
              getRendition={this.getRendition}
            />
          ) : null}
          <div id="tran-a" onClick={this.click} onMouseDown={this.mouse}>
            <div id="translateLayer-border" />
            <div id="translateLayer">
              {localFile2 || DEMO_URL2 ? (
                <ReactReader
                  triggeredPage={this.state.parentPage}
                  url={localFile2 || DEMO_URL2}
                  title={localName2 || DEMO_NAME2}
                  location0={location}
                  location={location2}
                  locationChanged={this.onLocationChanged2}
                  getRendition={this.getRendition2}
                />
              ) : null}
            </div>
          </div>
        </ReaderContainer>
      </Container>
    );
  }
}

export default App;
