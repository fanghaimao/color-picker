/**
 * 网页颜色吸管工具【拾色器】
 * date: 2021.10.31
 * author: alanyf
 */
import { domtoimage } from './dom-to-image.js';
import { drawTooltip, getCanvas, getCanvasRectColor, loadImage, rbgaObjToHex, renderColorInfo } from './helper';
import type { IProps, IRect } from './interface';

export * from './interface';



/** 
 * 网页拾色器【吸管工具】
 */
class ColorPipette {
  container: any = {};
  listener: Record<string, (e: any) => void> = {};
  rect: IRect = { x: 0, y: 0, width: 0, height: 0 };
  canvas: any = {};
  ctx: any;
  scale = 1;
  magnifier: any = null;
  colorContainer: any = null;
  colors: string[][] = [];
  tooltipVisible = true;
  useMagnifier = false;
  constructor(props: IProps) {
    try {
      const { container, listener, scale = 1, useMagnifier = false } = props;
      this.container = container || document.body;
      this.listener = listener || {};
      this.rect = this.container.getBoundingClientRect();
      this.scale = scale > 4 ? 4 : scale;
      this.useMagnifier = useMagnifier;
      // 去除noscript标签，可能会导致
      const noscript = document.body.querySelector('noscript');
      noscript?.parentNode?.removeChild(noscript);
      this.initCanvas();
    } catch (err) {
      console.error(err);
      this.destroy();
    }
  }
  /**
   * 初始化canvas
   */
  initCanvas() {
    const { rect, scale } = this;
    const { x, y, width, height } = rect;
    const { canvas, ctx } = getCanvas({
      width: rect.width,
      height: rect.height,
      scale,
      attrs: {
        class: 'color-pipette-canvas-container',
        style: `
           position: fixed;
           left: ${x}px;
           top: ${y}px;
           z-index: 10000;
           cursor: pointer;
           width: ${width}px;
           height: ${height}px;
         `,
      },
    });
    this.canvas = canvas;
    this.ctx = ctx;
  }
  /**
   * 开始
   */
  async start() {
    try {
      await this.drawCanvas();
      document.body.appendChild(this.canvas);
      const tooltip = drawTooltip('按Esc可退出');
      document.body.appendChild(tooltip);
      setTimeout(() => tooltip?.parentNode?.removeChild(tooltip), 1000);
      // 添加监听
      this.canvas.addEventListener('mousemove', this.handleMove);
      this.canvas.addEventListener('mousedown', this.handleDown);
      document.addEventListener('keydown', this.handleKeyDown);
    } catch (err) {
      console.error(err);
      this.destroy();
    }
  }
  /**
   * 结束销毁dom，清除事件监听
   */
  destroy() {
    this.canvas.removeEventListener('mousemove', this.handleMove);
    this.canvas.removeEventListener('mousedown', this.handleDown);
    document.removeEventListener('keydown', this.handleKeyDown);
    this.canvas?.parentNode?.removeChild(this.canvas);
    this.colorContainer?.parentNode?.removeChild(this.colorContainer);
  }

  /**
   * 将dom节点画到canvas里
   */
  async drawCanvas() {

    //@ts-ignore
    let domtoimages = domtoimage()
    //@ts-ignore
    const base64 = await domtoimages.toPng(this.container, { scale: this.scale }).catch(() => '');
    if (!base64) {
      return;
    }
    const img = await loadImage(base64);
    if (!img) {
      return;
    }
    this.ctx.drawImage(img, 0, 0, this.rect.width, this.rect.height);
  }

  /**
   * 处理鼠标移动
   */
  handleMove = (e: any) => {
    const { color, colors } = this.getPointColors(e);
    const { onChange = () => '' } = this.listener;
    const point = { x: e.pageX + 15, y: e.pageY + 15 };
    const colorContainer = renderColorInfo({
      containerDom: this.colorContainer,
      color,
      colors,
      point,
    });
    if (!this.colorContainer) {
      this.colorContainer = colorContainer;
      document.body.appendChild(colorContainer);
    }
    onChange({ color, colors });
  }

  /**
   * 处理鼠标按下
   */
  handleDown = (e: any) => {
    const { onOk = () => '' } = this.listener;
    e.preventDefault()
    e.stopPropagation && e.stopPropagation();
    e.nativeEvent && e.nativeEvent.stopImmediatePropagation && e.nativeEvent.stopImmediatePropagation();
    const res = this.getPointColors(e);
    onOk(res);
    this.destroy();
  }

  /**
   * 处理键盘按下Esc退出拾色
   */
  handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      this.destroy();
    }
  };

  /**
   * 获取鼠标点周围的颜色整列
   */
  getPointColors(e: any) {
    const { ctx, rect, scale } = this;
    let { pageX: x, pageY: y } = e;
    x -= rect.x;
    y -= rect.y;
    const color = this.getPointColor(x, y);
    const size = 19;
    const half = Math.floor(size / 2);
    const info = { x: x - half, y: y - half, width: size, height: size };
    const colors = getCanvasRectColor(ctx, info, scale);
    return { color, colors };
  }

  /**
   * 获取鼠标点的颜色
   */
  getPointColor(x: number, y: number) {
    const { scale } = this;
    const { data } = this.ctx.getImageData(x * scale, y * scale, 1, 1);
    const r = data[0];
    const g = data[1];
    const b = data[2];
    const a = data[3] / 255;
    const rgba = { r, g, b, a };
    return rbgaObjToHex(rgba);
  }
}

export default ColorPipette;
