import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Color from "./helpers/color";
import percentage from "./helpers/percentage";
const modesMap = ["RGB", "HSB"];

export default class Params extends React.Component {
  constructor(props) {
    super(props);

    // 管理 input 的状态
    this.state = {
      mode: props.mode,
      hex: props.color.hex,
      color: props.color, // instanceof tinycolor
    };
  }

  componentWillReceiveProps(nextProps) {
    const { color: nextColor } = nextProps;

    this.setState({
      color: nextColor,
      hex: nextColor.hex,
    });
  }

  getChannelInRange = (value, index) => {
    const channelMap = {
      RGB: [
        [0, 255],
        [0, 255],
        [0, 255],
      ],
      HSB: [
        [0, 359],
        [0, 100],
        [0, 100],
      ],
    };
    const mode = this.state.mode;
    const range = channelMap[mode][index];
    let result = parseInt(value, 10);
    if (isNaN(result)) {
      result = 0;
    }
    result = Math.max(range[0], result);
    result = Math.min(result, range[1]);
    return result;
  };

  getPrefixCls = () => {
    return `${this.props.rootPrefixCls}-params`;
  };

  // 验证颜色
  verifyColor = (color, noNeed3) => {
    // 如果是 hex 颜色 就需要 6 或者8位 颜色值
    if (/^#/.test(color)) {
      if (noNeed3) {
        return (
          /^#([\da-fA-F]{6})$/.test(color) || /^#([\da-fA-F]{8})$/.test(color)
        );
      } else {
        return (
          /^#([\da-fA-F]{6})$/.test(color) ||
          /^#([\da-fA-F]{8})$/.test(color) ||
          /^#([\da-fA-F]{3})$/.test(color)
        );
      }
    } else {
      // @ts-ignore
      if (this.isGradientColor(color)) {
        return false;
      }
      return false;
    }
  };

  /**
   * 暂时粗浅的判断是否渐变色
   * @param color
   * @returns
   */
  isGradientColor = (color) => {
    return color && typeof color === "object";
  };

  handleHexBlur = () => {
    const hex = this.state.hex;

    let color = null;

    if (Color.isValidHex(hex)) {
      color = new Color(hex);
    }

    if (color !== null) {
      this.setState({
        color,
        hex,
      });
      this.props.onChange(color, false);
    }
  };

  handleHexPress = (event) => {
    const hex = this.state.hex;
    const colorHex = hex.slice(1);
    if (event.nativeEvent.which === 13) {
      let color = null;

      if (Color.isValidHex(colorHex)) {
        color = new Color(colorHex);
      }

      if (color !== null) {
        this.setState({
          color,
          hex: colorHex,
        });
        this.props.onChange(color, false);
      }
    }
  };

  handlePaste = (event) => {
    let text = event.clipboardData.getData("text");
    if (!/^#/.test(text)) {
      text = `#${text}`;
    }
    if (this.verifyColor(text)) {
      this.setState({
        hex: text.slice(1),
      },()=>{
        this.handleHexBlur();
      });
      event.preventDefault();
      event.stopPropagation();
    }
  };

  handleHexChange = (event) => {
    const hex = event.target.value;

    this.setState(
      {
        hex: hex.slice(1),
      },
      () => {
        if (this.verifyColor(hex, true)) {
          this.handleHexBlur();
        }
      }
    );
  };

  handleModeChange = () => {
    let mode = this.state.mode;

    const modeIndex = (modesMap.indexOf(mode) + 1) % modesMap.length;

    mode = modesMap[modeIndex];

    this.setState({
      mode,
    });
  };

  handleAlphaHandler = (event) => {
    let alpha = parseInt(event.target.value, 10);

    if (isNaN(alpha)) {
      alpha = 0;
    }
    alpha = Math.max(0, alpha);
    alpha = Math.min(alpha, 100);

    this.props.onAlphaChange(alpha);
  };

  updateColorByChanel = (channel, value) => {
    const { color } = this.props;
    const { mode } = this.state;

    if (mode === "HSB") {
      if (channel === "H") {
        color.hue = parseInt(value, 10);
      } else if (channel === "S") {
        color.saturation = parseInt(value, 10) / 100;
      } else if (channel === "B") {
        color.brightness = parseInt(value, 10) / 100;
      }
    } else {
      if (channel === "R") {
        color.red = parseInt(value, 10);
      } else if (channel === "G") {
        color.green = parseInt(value, 10);
      } else if (channel === "B") {
        color.blue = parseInt(value, 10);
      }
    }

    return color;
  };

  handleColorChannelChange = (index, event) => {
    const value = this.getChannelInRange(event.target.value, index);
    const { mode } = this.state;
    const channel = mode[index];

    const color = this.updateColorByChanel(channel, value);

    this.setState(
      {
        hex: color.hex,
        color,
      },
      () => {
        this.props.onChange(color, false);
      }
    );
  };

  render() {
    const prefixCls = this.getPrefixCls();

    const { enableAlpha, paramsWidth } = this.props;
    const { mode, color } = this.state;
    const colorChannel = color[mode];

    if (mode === "HSB") {
      colorChannel[0] = parseInt(colorChannel[0], 10);
      colorChannel[1] = percentage(colorChannel[1]);
      colorChannel[2] = percentage(colorChannel[2]);
    }

    const paramsClasses = cx({
      [prefixCls]: true,
      [`${prefixCls}-has-alpha`]: enableAlpha,
    });

    return (
      <div className={paramsClasses}>
        <div className={`${prefixCls}-input`}>
          <input
            className={`${prefixCls}-hex`}
            type="text"
            maxLength="7"
            onKeyPress={this.handleHexPress}
            onBlur={this.handleHexBlur}
            onChange={this.handleHexChange}
            onPaste={this.handlePaste}
            value={
              this.state.hex.toLowerCase() === ""
                ? "#"
                : `#${this.state.hex.toLowerCase()}`
            }
            spellCheck="false"
            style={{
              width: paramsWidth ? "80px" : "160px",
              height: "32px",
              fontSize: "13px",
              color: "#262B33",
              borderRadius: "4px",
              outlineColor: "#2C7DFA",
            }}
          />
          {/* <input
            type="number"
            ref="channel_0"
            value={colorChannel[0]}
            onChange={this.handleColorChannelChange.bind(null, 0)}
          />
          <input
            type="number"
            ref="channel_1"
            value={colorChannel[1]}
            onChange={this.handleColorChannelChange.bind(null, 1)}
          />
          <input
            type="number"
            ref="channel_2"
            value={colorChannel[2]}
            onChange={this.handleColorChannelChange.bind(null, 2)}
          />
          {enableAlpha && (
            <input
              type="number"
              value={Math.round(this.props.alpha)}
              onChange={this.handleAlphaHandler}
            />
          )} */}
        </div>
        {/* <div className={`${prefixCls}-lable`}>
          <label className={`${prefixCls}-lable-hex`}>Hex</label>
          <label className={`${prefixCls}-lable-number`} onClick={this.handleModeChange}>
            {mode[0]}
          </label>
          <label className={`${prefixCls}-lable-number`} onClick={this.handleModeChange}>
            {mode[1]}
          </label>
          <label className={`${prefixCls}-lable-number`} onClick={this.handleModeChange}>
            {mode[2]}
          </label>
          {enableAlpha && <label className={`${prefixCls}-lable-alpha`}>A</label>}
        </div> */}
      </div>
    );
  }
}

Params.propTypes = {
  alpha: PropTypes.number,
  enableAlpha: PropTypes.bool,
  color: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(modesMap),
  onAlphaChange: PropTypes.func,
  onChange: PropTypes.func,
  rootPrefixCls: PropTypes.string,
};

Params.defaultProps = {
  mode: modesMap[0],
  enableAlpha: true,
};
