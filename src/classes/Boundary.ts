import { BoundaryType } from "../types/utils";

/**
 * 충돌 좌표를 위한 Boundary 클래스
 * @class Boundary
 * @property {HTMLCanvasElement} canvas
 * @property {{ x: number; y: number }} position
 * @property {{ width: number; height: number }} size
 * @returns {void}
 */
class Boundary {
  private canvas: HTMLCanvasElement;
  public position: { x: number; y: number };
  public size: { width: number; height: number };
  constructor({ canvas, position, size }: BoundaryType) {
    this.canvas = canvas;
    this.position = position;
    this.size = size;
  }

  /**
   * 충돌 좌표 그리기
   * @param param0 object
   * @param param0.transparent 투명도 0 ~ 1
   * @returns {void}
   */
  public draw({ transparent = 0.5 }: { transparent?: number }): void {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = `rgba(255, 0, 0, ${transparent})`;
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height,
    );
  }

  /**
   * 충돌 좌표 복제
   * @returns {Boundary}
   */
  public clone(): Boundary {
    return new Boundary({
      canvas: this.canvas,
      position: { ...this.position },
      size: { ...this.size },
    });
  }
}

export default Boundary;
