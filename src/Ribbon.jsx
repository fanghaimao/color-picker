import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import addEventListener from "rc-util/lib/Dom/addEventListener";
import _ from "lodash";

export default class Ribbon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: props.color,
    };
  }

  componentDidMount() {
    this.setState({
      color: this.props.color,
    });
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.color.hue, this.props.color.hue)) {
      this.setState({
        color: nextProps.color,
      });
    }
  }

  onMouseDown = (e) => {
    const x = e.clientX;
    const y = e.clientY;

    this.pointMoveTo({
      x,
      y,
    });

    this.dragListener = addEventListener(window, "mousemove", this.onDrag);
    this.dragUpListener = addEventListener(window, "mouseup", this.onDragEnd);
  };

  onDrag = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    this.pointMoveTo({
      x,
      y,
    });
  };

  onDragEnd = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    this.pointMoveTo(
      {
        x,
        y,
      },
      true
    );
    this.removeListeners();
  };

  getPrefixCls = () => {
    return `${this.props.rootPrefixCls}-ribbon`;
  };

  pointMoveTo = (coords, isEnd) => {
    const rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    const width = rect.width;
    let left = coords.x - rect.left;
    left = Math.max(0, left);
    left = Math.min(left, width);

    const huePercent = left / width;
    const hue = huePercent * 360;

    const { color } = this.state;

    color.hue = hue;

    this.props.onChange(color, undefined, undefined, isEnd);
  };

  removeListeners = () => {
    if (this.dragListener) {
      this.dragListener.remove();
      this.dragListener = null;
    }
    if (this.dragUpListener) {
      this.dragUpListener.remove();
      this.dragUpListener = null;
    }
  };

  render() {
    const prefixCls = this.getPrefixCls();
    const hue = this.state.color.hue;
    const per = (hue / 360) * 100;

    return (
      <div className={prefixCls}>
        <span
          ref="point"
          style={{
            left: per < 5 ? `calc(${0}%)` : `calc(${per}% - 12px)`,
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            boxShadow: "0px 0px 0px 2px rgba(0, 0, 0, 0.1)",
            backgroundColor: "unset",
            border: "2px solid #FFFFFF",
            marginTop: "1px",
          }}
        />
        <div
          className={`${prefixCls}-handler`}
          onMouseDown={this.onMouseDown}
        />
      </div>
    );
  }
}

Ribbon.propTypes = {
  rootPrefixCls: PropTypes.string,
  color: PropTypes.object,
  onChange: PropTypes.func,
};
