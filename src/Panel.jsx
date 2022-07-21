import React from "react";
import PropTypes from "prop-types";

import Color from "./helpers/color";

import Board from "./Board";
import Preview from "./Preview";
import Ribbon from "./Ribbon";
import Alpha from "./Alpha";
import Params from "./Params";
import StrawComponent from "./strawComponent";
import cx from "classnames";
// import Color2 from "color";


function noop() {}

export default class Panel extends React.Component {
  constructor(props) {
    super(props);

    const alpha =
      typeof props.alpha === "undefined"
        ? props.defaultAlpha
        : Math.min(props.alpha, props.defaultAlpha);

    const color = new Color(props.color || props.defaultColor);

    this.state = {
      color,
      alpha,
    };
  }

  componentDidMount() {
    this.props.onMount(this.ref);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.color, this.props.color)) {
      const color = new Color(nextProps.color);
      this.setState({
        color: color,
      });
    }

    if (nextProps.alpha !== undefined) {
      this.setState({
        alpha: nextProps.alpha,
      });
    }
  }

  onSystemColorPickerOpen = (e) => {
    // only work with broswer which support color input
    if (e.target.type === "color") {
      this.systemColorPickerOpen = true;
    }
  };

  onFocus = () => {
    if (this._blurTimer) {
      clearTimeout(this._blurTimer);
      this._blurTimer = null;
    } else {
      this.props.onFocus();
    }
  };

  onBlur = () => {
    if (this._blurTimer) {
      clearTimeout(this._blurTimer);
    }
    this._blurTimer = setTimeout(() => {
      // if is system color picker open, then stop run blur
      if (this.systemColorPickerOpen) {
        this.systemColorPickerOpen = false;
        return;
      }

      this.props.onBlur();
    }, 100);
  };

  /**
   * 响应 alpha 的变更
   * @param  {Number} alpha Range 0~100
   */
  handleAlphaChange = (alpha, isEnd) => {
    const { color } = this.state;
    color.alpha = alpha;

    this.setState({
      alpha,
      color,
    });

    this.props.onChange(
      {
        color: color.toHexString(),
        alpha,
      },
      undefined,
      undefined,
      isEnd
    );
  };

  /**
   * color change
   * @param  {Object}  color      tinycolor instance
   * @param  {Boolean} syncParams Sync to <Params />
   */
  handleChange = (color, syncParams, straw, isEnd) => {
    if (straw) {
      let colorObj = null;
      let hex = color.slice(1);
      if (Color.isValidHex(hex)) {
        colorObj = new Color(hex);
      }

      if (colorObj !== null) {
        this.handleChange(colorObj, false, false, isEnd);
      }
    } else {
      const { alpha } = this.state;
      color.alpha = alpha;

      let a = color.toHexString();
      let aa = new Color(a);

      if(aa.hue !== color.hue){
        console.log(aa, color)
      }


      this.setState({ color });
      this.props.onChange(
        {
          color: color.toHexString(),
          alpha: color.alpha,
          saturation: color.saturation,
          hue: color.hue,
        },
        undefined,
        undefined,
        isEnd
      );
    }
  };

  handleCollect = () => {
    if (this.props.collectionCallback) {
      const { color } = this.state;
      const { isFavor } = this.props;
      color.isFavor = isFavor;
      this.props.collectionCallback(color);
    }
  };

  handleClose = () => {
    const { handleClosePanel } = this.props;
    handleClosePanel && handleClosePanel();
  };

  render() {
    let {
      prefixCls,
      enableAlpha,
      needStraw = true,
      needCollect = true,
      isFavor,
    } = this.props;
    const { color, alpha } = this.state;

    let isPreviewWidth = false;
    if (needStraw && !needCollect) {
      isPreviewWidth = true;
    }

    let paramsWidth = false;
    if (needStraw) {
      paramsWidth = true;
    }
    const wrapClasses = cx({
      [`${prefixCls}-wrap`]: true,
      [`${prefixCls}-wrap-has-alpha`]: enableAlpha,
    });

    return (
      <div
        ref={(ref) => (this.ref = ref)}
        id="rc_color_picker"
        className={[prefixCls, this.props.className].join(" ")}
        style={this.props.style}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        key={this.state.color}
        // onMouseLeave={this.handleStopPop}
        // onDoubleClick={this.handleStopPop}
        // onTouchMove={this.handleStopPop}
        // onClick={this.handleStopPop}
        tabIndex="0"
      >
        <div className={`${prefixCls}-inner`}>
          <div
            className="close_panel"
            style={{
              position: "absolute",
              top: "4px",
              right: " 4px",
              cursor: "pointer",
            }}
            onClick={this.handleClose}
          >
            <svg
              t="1652239239635"
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="10208"
              width="16"
              height="16"
            >
              <path
                d="M572.864 512l182.592-182.592a43.2 43.2 0 0 0 0-60.864 43.136 43.136 0 0 0-60.8 0L512 451.136 329.408 268.544a43.2 43.2 0 0 0-60.864 0 43.264 43.264 0 0 0 0 60.864L451.072 512l-182.528 182.592a43.264 43.264 0 0 0 0 60.864c16.768 16.704 44.096 16.704 60.8 0L512 572.864l182.592 182.592c16.768 16.704 44.16 16.704 60.864 0a43.2 43.2 0 0 0 0-60.864L572.864 512z"
                p-id="10209"
                fill="#9DA2AD"
              ></path>
            </svg>
          </div>
          <Board
            rootPrefixCls={prefixCls}
            color={color}
            onChange={this.handleChange}
          />
          <div className={wrapClasses} style={{ width: "300px" }}>
            <div className={`${prefixCls}-wrap-ribbon`}>
              <Ribbon
                rootPrefixCls={prefixCls}
                color={color}
                onChange={this.handleChange}
              />
            </div>
            {enableAlpha && (
              <div className={`${prefixCls}-wrap-alpha`}>
                <Alpha
                  rootPrefixCls={prefixCls}
                  alpha={alpha}
                  color={color}
                  onChange={this.handleAlphaChange}
                />
              </div>
            )}
          </div>
          <div
            className={`${prefixCls}-wrap`}
            style={{
              height: 32,
              marginTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className={`${prefixCls}-wrap-preview`}>
              <Preview
                rootPrefixCls={prefixCls}
                alpha={alpha}
                onChange={this.handleChange}
                onInputClick={this.onSystemColorPickerOpen}
                color={color}
                isPreviewWidth={isPreviewWidth}
              />
            </div>
            <Params
              rootPrefixCls={prefixCls}
              color={color}
              alpha={alpha}
              onAlphaChange={this.handleAlphaChange}
              onChange={this.handleChange}
              mode={this.props.mode}
              enableAlpha={this.props.enableAlpha}
              paramsWidth={paramsWidth}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {
                // 收藏功能
                needCollect && (
                  <div
                    className="collect"
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    onClick={this.handleCollect}
                  >
                    {isFavor ? (
                      <svg
                        t="1651820970143"
                        className="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="9468"
                        width="16"
                        height="16"
                      >
                        <path
                          d="M1017.6 390.4c-6.4-19.2-25.6-38.4-44.8-44.8l-262.4-70.4L569.6 51.2C544 12.8 480 12.8 454.4 51.2L307.2 275.2l-256 70.4c-25.6 6.4-38.4 25.6-44.8 44.8-6.4 19.2 0 44.8 12.8 64l166.4 211.2-12.8 268.8c0 25.6 6.4 44.8 25.6 57.6 19.2 12.8 44.8 19.2 64 6.4L512 902.4l249.6 96c6.4 0 12.8 6.4 25.6 6.4s25.6-6.4 38.4-12.8c19.2-12.8 25.6-32 25.6-57.6l-12.8-268.8 166.4-211.2c19.2-19.2 25.6-44.8 12.8-64z"
                          p-id="9469"
                          fill="#ffb500"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="icon"
                        width="16px"
                        height="16.00px"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#414751"
                          d="M512 198.4l96 147.2 25.6 38.4 44.8 12.8 172.8 51.2-108.8 134.4-32 38.4v51.2l6.4 172.8-166.4-64-38.4-19.2-44.8 19.2-166.4 64 6.4-172.8v-51.2l-25.6-38.4L172.8 448l166.4-44.8 44.8-12.8 25.6-38.4L512 198.4M512 25.6c-19.2 0-44.8 6.4-57.6 25.6L307.2 275.2l-256 70.4c-25.6 6.4-38.4 25.6-44.8 44.8-6.4 19.2 0 44.8 12.8 64l166.4 211.2-12.8 268.8c0 25.6 6.4 44.8 25.6 57.6 12.8 6.4 25.6 12.8 38.4 12.8 6.4 0 19.2 0 25.6-6.4L512 902.4l249.6 96c6.4 0 12.8 6.4 25.6 6.4s25.6-6.4 38.4-12.8c19.2-12.8 25.6-32 25.6-57.6l-12.8-268.8 166.4-211.2c12.8-19.2 19.2-38.4 12.8-64-6.4-19.2-25.6-38.4-44.8-44.8l-262.4-70.4L569.6 51.2C556.8 32 531.2 25.6 512 25.6z"
                        />
                      </svg>
                    )}
                  </div>
                )
              }
              {needStraw && (
                <StrawComponent
                  color={color}
                  onChange={this.handleChange}
                  userDom={this.props.userDom}
                  strawCallback={this.props.strawCallback}
                  isStrawStatus={this.props.isStrawStatus}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

import typeColor from "./utils/validationColor";
import _, { cloneDeep } from "lodash";

Panel.propTypes = {
  alpha: PropTypes.number,
  className: PropTypes.string,
  color: typeColor, // Hex string
  defaultAlpha: PropTypes.number,
  defaultColor: typeColor, // Hex string
  enableAlpha: PropTypes.bool,
  mode: PropTypes.oneOf(["RGB", "HSL", "HSB"]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onMount: PropTypes.func,
  prefixCls: PropTypes.string,
  style: PropTypes.object,
};

Panel.defaultProps = {
  className: "",
  defaultAlpha: 100,
  defaultColor: "#ff0000",
  enableAlpha: true,
  mode: "RGB",
  onBlur: noop,
  onChange: noop,
  onFocus: noop,
  onMount: noop,
  prefixCls: "rc-color-picker-panel",
  style: {},
};
