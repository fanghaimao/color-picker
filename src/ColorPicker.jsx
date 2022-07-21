import React from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import Trigger, { __esModule } from "rc-trigger";
import ColorPickerPanel from "./Panel";
import placements from "./placements";

import Color from "./helpers/color";
import _ from "lodash";

function refFn(field, component) {
  this[field] = component;
}

function prevent(e) {
  e.preventDefault();
}

export default class ColorPicker extends React.Component {
  constructor(props) {
    super(props);

    const alpha =
      typeof props.alpha === "undefined"
        ? props.defaultAlpha
        : Math.min(props.alpha, props.defaultAlpha);

    this.state = {
      color: props.color || props.defaultColor,
      alpha,
      open: props.visible,
      hue: props.hue,
    };

    const events = [
      "onTriggerClick",
      "onChange",
      "onBlur",
      "getPickerElement",
      "getRootDOMNode",
      "getTriggerDOMNode",
      "onVisibleChange",
      "onPanelMount",
      "setOpen",
      "open",
      "close",
      "focus",
    ];

    events.forEach((e) => {
      this[e] = this[e].bind(this);
    });

    this.saveTriggerRef = refFn.bind(this, "triggerInstance");
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.color, this.props.color)) {
      this.setState({
        color: nextProps.color,
      });
    }
    if (nextProps.alpha !== null && nextProps.alpha !== undefined) {
      this.setState({
        alpha: nextProps.alpha,
      });
    }

    if (nextProps.visible !== this.state.open) {
      this.setState({
        open: nextProps.visible,
      });
    }
  }

  onTriggerClick() {
    this.setState({
      open: !this.state.open,
    });
  }

  onChange(colors, status1, status2, isEnd) {
    this.setState(
      {
        ...colors,
        straw: colors.straw,
      },
      () => {
        this.props.onChange(this.state, isEnd);
      }
    );
  }

  onBlur() {
    this.setOpen(false);
  }

  onVisibleChange(open) {
    this.setOpen(open);
  }

  handleClosePanel = () => {
    this.setState(
      {
        visible: false,
        open: false,
      },
      () => {
        const { onClose } = this.props;
        if(window.s_FTColorAttribute){
          window.s_FTColorAttribute.deleteCurrentColor()
        }
        onClose && onClose(this.state);
      }
    );
  };

  onPanelMount(panelDOMRef) {
    if (this.state.open) {
      setTimeout(() => {
        panelDOMRef.focus();
      }, 1);
    }
  }

  setOpen(open, callback) {
    if (this.state.open !== open) {
      this.setState(
        {
          open,
        },
        () => {
          if (typeof callback === "function") callback();
          const { onOpen, onClose } = this.props;
          if (this.state.open) {
            onOpen(this.state);
          } else {
            onClose && onClose(this.state);
          }
        }
      );
    }
  }

  getRootDOMNode() {
    return findDOMNode(this);
  }

  getTriggerDOMNode() {
    return findDOMNode(this.triggerInstance);
  }

  getPickerElement = () => {
    // const state = this.state;
    const {
      needStraw,
      needCollect,
      userDom,
      collectionCallback,
      isFavor,
      isStrawStatus,
      getCalendarContainer,
    } = this.props;

    return (
      <ColorPickerPanel
        onMount={this.onPanelMount}
        defaultColor={this.state.color}
        color={this.state.color}
        saturation={this.state.saturation}
        hue={this.state.hue}
        alpha={this.state.alpha}
        enableAlpha={this.props.enableAlpha}
        prefixCls={`${this.props.prefixCls}-panel`}
        onChange={this.onChange}
        // onBlur={this.onBlur}
        mode={this.props.mode}
        className={this.props.className}
        needStraw={needStraw}
        needCollect={needCollect}
        userDom={userDom}
        strawCallback={this.props.strawCallback}
        isFavor={isFavor}
        isStrawStatus={isStrawStatus}
        collectionCallback={collectionCallback}
        handleClosePanel={this.handleClosePanel}
      />
    );
  };

  open(callback) {
    this.setOpen(true, callback);
  }

  close(callback) {
    this.setOpen(false, callback);
  }

  focus() {
    if (!this.state.open) {
      findDOMNode(this).focus();
    }
  }

  handlePropClick = () => {
    const { onOpen, onClose } = this.props;
    this.setState(
      {
        visible: !this.state.visible,
      },
      () => {
        if (this.state.visible) {
          onOpen && onOpen(this.state);
        } else {
          onClose && onClose(this.state);
        }
      }
    );
  };

  handleStopPop = (e) => {
    e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    e.nativeEvent &&
      e.nativeEvent.stopImmediatePropagation &&
      e.nativeEvent.stopImmediatePropagation();
  };

  render() {
    const props = this.props;
    const state = this.state;
    const { visible } = this.state;
    const classes = [`${props.prefixCls}-wrap`, props.className];
    if (state.open) {
      classes.push(`${props.prefixCls}-open`);
    }

    let children = props.children;

    const [r, g, b] = new Color(this.state.color).RGB;
    const RGBA = [r, g, b];

    RGBA.push(this.state.alpha / 100);

    if (children) {
      children = React.cloneElement(children, {
        ref: this.saveTriggerRef,
        unselectable: "unselectable",
        style: {
          backgroundColor: `rgba(${RGBA.join(",")})`,
        },
        onClick: this.onTriggerClick,
        onMouseDown: prevent,
      });
    }

    const {
      prefixCls,
      placement,
      style,
      getCalendarContainer,
      align,
      animation,
      disabled,
      transitionName,
      hideChild,
    } = props;

    return (
      <div className={classes.join(" ")}>
        <Trigger
          popup={this.getPickerElement()}
          popupAlign={align}
          builtinPlacements={placements}
          popupPlacement={placement}
          action={disabled ? [] : ["click"]}
          destroyPopupOnHide
          getPopupContainer={getCalendarContainer}
          popupStyle={style}
          popupAnimation={animation}
          popupTransitionName={transitionName}
          popupVisible={this.state.open}
          onPopupVisibleChange={this.onVisibleChange}
          prefixCls={prefixCls}
        >
          {hideChild ? (
            <div style={{ height: "0px" }}></div>
          ) : (
            <div onClick={this.handlePropClick}>{children}</div>
          )}
        </Trigger>
      </div>
    );
  }
}

ColorPicker.propTypes = {
  defaultColor: PropTypes.string,
  defaultAlpha: PropTypes.number,
  // can custom
  alpha: PropTypes.number,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  enableAlpha: PropTypes.bool,
  mode: PropTypes.oneOf(["RGB", "HSL", "HSB"]),
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  placement: PropTypes.oneOf([
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight",
  ]),
  prefixCls: PropTypes.string.isRequired,
  style: PropTypes.object,
};

ColorPicker.defaultProps = {
  defaultColor: "#F00",
  defaultAlpha: 100,
  onChange() {},
  onOpen() {},
  onClose() {},
  children: <span className="rc-color-picker-trigger" />,
  className: "",
  enableAlpha: true,
  placement: "topLeft",
  prefixCls: "rc-color-picker",
  style: {},
};
