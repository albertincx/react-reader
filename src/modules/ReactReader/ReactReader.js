import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { useSwipeable } from 'react-swipeable';
import { EpubView } from '..';
import defaultStyles from './style';

const Swipeable = ({ children, style, ...props }) => {
  const handlers = useSwipeable(props);
  return (<div style={style} {...handlers}>{children}</div>);
};

class TocItem extends PureComponent {
  setLocation = () => {
    this.props.setLocation(this.props.href);
  };

  render() {
    const { label, styles } = this.props;
    return (
      <button onClick={this.setLocation} style={styles}>
        {label}
      </button>
    );
  }
}

TocItem.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  setLocation: PropTypes.func,
  styles: PropTypes.object,
};

class ReactReader extends PureComponent {
  constructor(props) {
    super(props);
    this.readerRef = React.createRef();
    this.state = {
      expandedToc: false,
      toc: false,
    };
  }

  toggleToc = () => {
    this.setState({
      expandedToc: !this.state.expandedToc,
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if ((
      prevProps.location0 !== this.props.location0
    )) {
      const node = this.readerRef.current;
      if (node) {
        if (this.props.triggeredPage === 'next') {
          node.nextPage();
        } else if (this.props.triggeredPage === 'prev') {
          node.prevPage();
        }
      }
    }
  }

  next = () => {
    const node = this.readerRef.current;
    if (this.props.triggerPage) this.props.triggerPage('next');
    node.nextPage();
  };

  prev = () => {
    const node = this.readerRef.current;
    if (this.props.triggerPage) this.props.triggerPage('prev');
    node.prevPage();
  };

  onTocChange = toc => {
    const { tocChanged } = this.props;
    this.setState(
      {
        toc: toc,
      },
      () => tocChanged && tocChanged(toc),
    );
  };

  renderToc() {
    const { toc, expandedToc } = this.state;
    const { styles } = this.props;
    return (
      <div>
        <div style={styles.tocArea}>
          <div style={styles.toc}>
            {toc.map((item, i) => (
              <TocItem
                {...item}
                key={i}
                setLocation={this.setLocation}
                styles={styles.tocAreaButton}
              />
            ))}
          </div>
        </div>
        {expandedToc && (
          <div style={styles.tocBackground} onClick={this.toggleToc}/>
        )}
      </div>
    );
  }

  setLocation = loc => {
    const { locationChanged } = this.props;
    this.setState(
      {
        expandedToc: false,
      },
      () => locationChanged && locationChanged(loc),
    );
  };

  renderTocToggle() {
    const { expandedToc } = this.state;
    const { styles } = this.props;
    return (
      <button
        style={Object.assign(
          {},
          styles.tocButton,
          expandedToc ? styles.tocButtonExpanded : {},
        )}
        onClick={this.toggleToc}
      >
        <span
          style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBarTop)}
        />
        <span
          style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBottom)}
        />
      </button>
    );
  }

  render() {
    const {
      showToc,
      loadingView,
      styles,
      locationChanged,
      swipeable,
      className,
      ...props
    } = this.props;
    const { expandedToc } = this.state;
    return (
      <div className={className} style={styles.container}>
        <div
          style={Object.assign(
            {},
            styles.readerArea,
            expandedToc ? styles.containerExpanded : {},
          )}
        >
          <Swipeable
            onSwipedRight={this.prev}
            onSwipedLeft={this.next}
            trackMouse
            style={styles.Swipeable}
          >
            <div style={styles.reader}>
              <EpubView
                ref={this.readerRef}
                loadingView={loadingView}
                {...props}
                tocChanged={this.onTocChange}
                locationChanged={locationChanged}
              />
              {swipeable && <div style={styles.swipeWrapper}/>}
            </div>
          </Swipeable>
          <button
            className="second-btn left"
            style={Object.assign({}, styles.arrow, styles.prev)}
            onClick={this.next}
          >
            ›
          </button>
          <button
            style={Object.assign({}, styles.arrow, styles.prev)}
            onClick={this.prev}
          >
            ‹
          </button>
          <button
            className="second-btn right"
            style={Object.assign({}, styles.arrow, styles.next)}
            onClick={this.prev}
          >
            ‹
          </button>
          <button
            style={Object.assign({}, styles.arrow, styles.next)}
            onClick={this.next}
          >
            ›
          </button>
        </div>
      </div>
    );
  }
}

ReactReader.defaultProps = {
  loadingView: <div style={defaultStyles.loadingView}>Loading…</div>,
  locationChanged: null,
  tocChanged: null,
  showToc: true,
  styles: defaultStyles,
};

ReactReader.propTypes = {
  loadingView: PropTypes.element,
  showToc: PropTypes.bool,
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,
  styles: PropTypes.object,
  swipeable: PropTypes.bool,
};

export default ReactReader;
