import React, { Component } from "react";
import Qusheqi from "./icon/quseqi.svg";
import ColorPipette from "./StrawXG/index.ts";
import Color from "./helpers/color";

export default class strawComponent extends Component {
  handleStraw = (e) => {
    e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    e.nativeEvent &&
      e.nativeEvent.stopImmediatePropagation &&
      e.nativeEvent.stopImmediatePropagation();
    const { onChange, color, userDom, strawCallback } = this.props;
    if (strawCallback) {
      strawCallback(onChange, e);
    } else {
      let dom = document.querySelector("#root");
      let domBody = document.querySelector("body");
      const pipette = new ColorPipette({
        container: userDom || dom || domBody,
        scale: 3,
        listener: {
          onOk: ({ color, colors }) => {
            let colorObj = null;
            let hex = color.slice(1);
            if (Color.isValidHex(hex)) {
              colorObj = new Color(hex);
            }

            if (colorObj !== null) {
              onChange(colorObj, false, "straw");
            }
          },
        },
      });

      // 开始取色
      pipette.start();
    }
  };

  render() {
    const { isStrawStatus } = this.props;
    return (
      <div
        className="straw"
        style={{
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "24px",
          cursor: "pointer",
        }}
        onClick={this.handleStraw}
      >
        <svg
          className="icon"
          width="16px"
          height="16.00px"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={isStrawStatus ? "#2C7DFA" : "#414751"}
            d="M988.16 92.16L926.72 30.72c-40.96-40.96-102.4-40.96-143.36 0l-143.36 143.36L573.44 102.4 440.32 240.64l56.32 56.32-389.12 394.24c-25.6 25.6-40.96 61.44-40.96 92.16l-20.48 20.48c-46.08 51.2-46.08 128 0 179.2 20.48 25.6 51.2 40.96 81.92 40.96s66.56-15.36 87.04-35.84l20.48-20.48c35.84 0 66.56-15.36 92.16-40.96l389.12-394.24 56.32 56.32 138.24-138.24-66.56-71.68 143.36-143.36c40.96-40.96 40.96-102.4 0-143.36m-716.8 768c-10.24 10.24-25.6 15.36-35.84 15.36-10.24 0-15.36 0-25.6-5.12L153.6 921.6c-5.12 5.12-15.36 10.24-25.6 10.24s-20.48-5.12-25.6-10.24c-15.36-15.36-15.36-35.84 0-51.2l56.32-51.2c-10.24-20.48-5.12-46.08 10.24-61.44l389.12-394.24 102.4 102.4-389.12 394.24z m0 0"
          />
        </svg>
      </div>
    );
  }
}
