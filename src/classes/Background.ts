type BackgroundType = {
  canvas: HTMLCanvasElement | null;
  image: HTMLImageElement;
  position: { x: number; y: number };
};

/**
 * 배경 스프라이트 클래스
 * @class Background
 * @property {HTMLCanvasElement | null} canvas 캔버스 엘리먼트
 * @property {HTMLImageElement} image 이미지 엘리먼트
 * @property {{ x: number; y: number }} position 캐릭터 위치
 * @property {boolean} moving 이동 여부
 * @returns {void}
 */
class Background {
  public canvas: HTMLCanvasElement | null;
  public position: { x: number; y: number };
  public image: HTMLImageElement;
  public moving: boolean;
  constructor({ canvas, image, position }: BackgroundType) {
    this.canvas = canvas;
    this.position = position;
    this.image = image;
    this.moving = false;
  }

  /**
   * 배경 그리기
   * @returns {void}
   */
  public draw(): void {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.canvas.width * 7.27,
      this.canvas.height * 3.63,
    );
  }
}

export default Background;
