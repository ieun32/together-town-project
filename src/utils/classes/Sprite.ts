import { SpriteType } from "../../types/utils";

/**
 * 캐릭터 스프라이트 클래스
 * @class Sprite
 * @param {SpriteType} { canvas, image, position, sprites, scaleFactor, nickname }
 * @property {string} nickname 닉네임
 * @property {HTMLCanvasElement | null} canvas 캔버스 엘리먼트
 * @property {HTMLImageElement} image 이미지 엘리먼트
 * @property {{ x: number; y: number }} position 캐릭터 위치
 * @property {number} scaleFactor 캐릭터 이미지 크기 배율
 * @property {{ val: number; elapsed: number }} frame 프레임
 * @property {boolean} moving 이동 여부
 * @property {{ [key: string]: HTMLImageElement }} sprites 이동 방향 이미지
 * @return {void}
 */
class Sprite {
  public nickname: string;
  public canvas: HTMLCanvasElement | null;
  public position: { x: number; y: number };
  public image: HTMLImageElement;
  public scaleFactor: number;
  public frame: { val: number; elapsed: number };
  public moving: boolean;
  public sprites: { [key: string]: HTMLImageElement };
  constructor({
    canvas,
    image,
    position,
    sprites,
    scaleFactor,
    nickname,
  }: SpriteType) {
    this.canvas = canvas;
    this.position = position;
    this.scaleFactor = scaleFactor;
    this.image = image;
    this.frame = { val: 0, elapsed: 0 };
    this.moving = false;
    this.sprites = sprites;
    this.nickname = nickname;
  }

  /**
   * 캐릭터 그리기
   * @returns {void}
   */
  public draw(): void {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const imgWidth = (this.image.width / 4) * this.scaleFactor;
    const imgHeight = this.image.height * this.scaleFactor;

    ctx.drawImage(
      this.image, // 그릴 이미지
      this.frame.val * (this.image.width / 4), // 이미지에서 시작할 x 좌표
      0, // 이미지에서 시작할 y 좌표
      this.image.width / 4, // 이미지에서 그릴 부분의 너비
      this.image.height, // 이미지에서 그릴 부분의 높이
      this.position.x, // 캔버스에서 이미지를 그릴 x 좌표
      this.position.y, // 캔버스에서 이미지를 그릴 y 좌표
      imgWidth, // 캔버스에 그릴 이미지의 너비
      imgHeight, // 캔버스에 그릴 이미지의 높이
    );

    this.drawNickname();

    if (!this.moving) return;
    this.frame.elapsed += 1; // 프레임 카운트
    if (this.frame.elapsed % 5 === 0) {
      // 5 프레임마다 걷는 모션 변경
      this.frame.val = (this.frame.val + 1) % 4;
    }
  }

  /**
   * 닉네임 그리기
   * @returns {void}
   */
  private drawNickname(): void {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const imgWidth = this.image.width * this.scaleFactor;

    ctx.fillStyle = "rgba(128, 128, 128, 0.5)";
    ctx.fillRect(
      this.position.x + imgWidth / 8 - ctx.measureText(this.nickname).width / 2,
      this.position.y - 25,
      ctx.measureText(this.nickname).width,
      20,
    );
    ctx.fillStyle = "white";
    ctx.font = `bold ${16 * this.scaleFactor}px Gulim`;
    ctx.textAlign = "center";
    ctx.fillText(
      this.nickname,
      this.position.x + imgWidth / 8,
      this.position.y - 10,
    );
  }

  /**
   * 닉네임 변경하고 다시 그리기
   * @param nickname 닉네임
   */
  public changeNickname(nickname: string) {
    this.nickname = nickname;
    this.drawNickname();
  }
}

export default Sprite;
