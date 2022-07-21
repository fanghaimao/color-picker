import React from "react";
import PropTypes from "prop-types";

import Color from "./helpers/color";

export default class Preview extends React.Component {
  onChange = (e) => {
    const value = e.target.value;
    const color = new Color(value);
    this.props.onChange(color);
    e.stopPropagation();
  };

  getPrefixCls = () => {
    return `${this.props.rootPrefixCls}-preview`;
  };

  render() {
    let { isPreviewWidth } = this.props;
    const prefixCls = this.getPrefixCls();
    const hex = this.props.color.toHexString();
    return (
      <div
        className={prefixCls}
        style={isPreviewWidth ? { width: "100px" } : {}}
      >
        <span
          style={{
            backgroundColor: hex,
            opacity: this.props.alpha / 100,
            width: isPreviewWidth ? "100px" : '80px',
            boxShadow: '0 0 4px rgb(0 0 0 / 15%) inset'
          }}
        />
        {/* <input
          type="color"
          value={hex}
          onChange={this.onChange}
          onClick={this.props.onInputClick}
          style={isPreviewWidth ? { width: "100px" } : {}}
        /> */}
      </div>
    );
  }
}

Preview.propTypes = {
  rootPrefixCls: PropTypes.string,
  color: PropTypes.object,
  alpha: PropTypes.number,
  onChange: PropTypes.func,
  onInputClick: PropTypes.func,
};
