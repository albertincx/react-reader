import React, { Component } from "react";
import localforage from "localforage";
import FileReaderInput from "react-file-reader-input";

import { GlobalStyle } from "./styles";
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
    localforage.getItem('apiprocread_cache').then(async (value) => {
      const filename = await localforage.getItem('apiprocread_cache_name').catch(function(err) {
      }) || ''
      this.setState({localFile: value, localName: filename});
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
      await localforage.setItem('apiprocread_cache_name', file.name).catch(function(err) {
      })
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
            <div className="title">{localName || ''}</div>
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
