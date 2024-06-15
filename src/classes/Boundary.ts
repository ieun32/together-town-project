import { BoundaryType } from "../types/utils";

/**
 * 충돌 좌표를 위한 클래스
 * @param {HTMLCanvasElement} canvas 캔버스 엘리먼트
 * @param {object} position 좌표 정보
 * @param {object} size 크기 정보
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
   * @param {object} param 설정
   * @param {number} param.transparent 투명도
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
   * 충돌 좌표 복제 메서드
   * @returns {Boundary} 충돌 좌표 인스턴스
   */
  public clone() {
    return new Boundary({
      canvas: this.canvas,
      position: { ...this.position },
      size: { ...this.size },
    });
  }
}

export default Boundary;
