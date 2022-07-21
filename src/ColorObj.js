
class FTColorAttribute {
  currentColor; // 是否是取色状态

  constructor(props) {
    this.currentColor = {}
  }

  init(successCall) {
  }

  setCurrentColor(colorObj) {
    this.currentColor[colorObj.color] = colorObj
  }

  getColorObj(color) {
    if (this.currentColor.hasOwnProperty(color)) {
      return this.currentColor[color]
    }
  }

  deleteCurrentColor() {
    this.currentColor = {}
  }

}

export let s_FTColorAttribute = new FTColorAttribute();

// @ts-ignore
window.s_FTColorAttribute = s_FTColorAttribute
