import React, { Component } from "react";
import ColorPicker from "../src/ColorPicker";
import "rc-color-picker/assets/index.less";

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      color: "#33336c",
    };
  }
  changeHandler(colors, isEnd) {
  }

  closeHandler(colors) {
  }

  handleClick = (e, colors) => {
    e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    e.nativeEvent &&
      e.nativeEvent.stopImmediatePropagation &&
      e.nativeEvent.stopImmediatePropagation();
    this.setState({
      visible: true,
      color: colors,
    });
  };

  render() {
    const { visible, color } = this.state;
    return (
      <div className="aaa">
        <div>
          <ColorPicker
            color={color}
            alpha={30}
            onChange={this.changeHandler}
            onClose={this.closeHandler}
            getCalendarContainer={(res) => {
              return res.parentNode.parentNode.parentNode.parentNode
            }}
            visible={true}
            placement="topLeft"
            className="some-class"
            hideChild={true}
    
          >
            <span className="rc-color-picker-trigger" />
          </ColorPicker>

          <div
            id='a'
            onClick={(e) => {
              this.handleClick(e, "#000000");
            }}
            style={{ marginRight: "100px" }}
          >
            {" "}
            1
          </div>
          <div
            onClick={(e) => {
              this.handleClick(e, "#333333");
            }}
            style={{ marginRight: "100px" }}
          >
            {" "}
            2
          </div>
          <div
            onClick={(e) => {
              this.handleClick(e, "#0099ff");
            }}
            style={{ marginRight: "100px" }}
          >
            {" "}
            3
          </div>
          <div
            onClick={(e) => {
              this.handleClick(e, "#0fd850");
            }}
            style={{ marginRight: "100px" }}
          >
            {" "}
            4
          </div>
          <div
            onClick={(e) => {
              this.handleClick(e, "#b1c241");
            }}
            style={{ marginRight: "100px" }}
          >
            {" "}
            5
          </div>
        </div>
      </div>
    );
  }
}

// ReactDOM.render(
//   <div style={{ margin: '20px 20px 20px', textAlign: 'center' }}>
//   <Test />

//    <div onClick={handleClick}> asdasd</div>

//   </div>,
//   document.getElementById('__react-content'),
// );
