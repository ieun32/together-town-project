import { SpriteType } from "../types/utils";
import knife from "../assets/images/knife.png";
import fire from "../assets/images/fire.png";

/**
 * 캐릭터 스프라이트 클래스
 * @class Sprite
 * @property {string} nickname 닉네임
 * @property {HTMLCanvasElement | null} canvas 캔버스 엘리먼트
 * @property {HTMLImageElement} image 이미지 엘리먼트
 * @property {{ x: number; y: number }} position 캐릭터 위치
 * @property {number} scaleFactor 캐릭터 이미지 크기 배율
 * @property {{ val: number; elapsed: number }} frame 프레임
 * @property {boolean} moving 이동 여부
 * @property {{ [key: string]: HTMLImageElement }} sprites 이동 방향 이미지
 * @returns {void}
 */
class Sprite {
  public nickname: string;
  public canvas: HTMLCanvasElement | null;
  public position: {
    x: number;
    y: number;
    absoluteX: number;
    absoluteY: number;
  };
  public image: HTMLImageElement;
  public scaleFactor: number;
  public frame: { val: number; elapsed: number };
  public moving: boolean;
  public sprites: { [key: string]: HTMLImageElement };
  public cursor: { x: number; y: number };
  public blocksize: number;
  public weapon: string | null;
  public attack: { state: boolean; endX: number; endY: number; angle: number };
  public health: number;
  constructor({
    canvas,
    image,
    position,
    sprites,
    scaleFactor,
    nickname,
    cursor,
    blocksize,
    weapon,
    attack,
    health,
  }: SpriteType) {
    this.canvas = canvas;
    this.position = {
      x: position.x,
      y: position.y,
      absoluteX: position.absoluteX,
      absoluteY: position.absoluteY,
    };
    this.scaleFactor = scaleFactor;
    this.image = image;
    this.frame = { val: 0, elapsed: 0 };
    this.moving = false;
    this.attack = attack;
    this.sprites = sprites;
    this.nickname = nickname;
    this.cursor = cursor ? { x: cursor.x, y: cursor.y } : { x: 0, y: 0 };
    this.blocksize = blocksize;
    this.weapon = weapon;
    this.health = health === undefined ? 100 : health;
  }

  /**
   * 캐릭터 그리기
   * @returns {void}
   */
  public draw(): void {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    if (!this.image) return;
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
    this.drawHealth();

    if (this.attack.state) {
      this.drawWeapon();
    }

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
      this.position.y - 30,
      ctx.measureText(this.nickname).width,
      20,
    );
    ctx.fillStyle = "white";
    ctx.font = `bold ${16 * this.scaleFactor}px Gulim`;
    ctx.textAlign = "center";
    ctx.fillText(
      this.nickname,
      this.position.x + imgWidth / 8,
      this.position.y - 15,
    );
  }

  /**
   * 닉네임 변경하고 다시 그리기
   * @param {string} nickname 닉네임
   */
  public changeNickname(nickname: string) {
    this.nickname = nickname;
    this.drawNickname();
  }

  /**
   * 무기 그리기
   * @returns {void}
   */
  private drawWeapon(): void {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = this.weapon === "knife" ? knife : fire;

    // 반지름 길이
    const radius =
      this.weapon === "knife" ? this.blocksize : this.blocksize * 5;

    // 캐릭터의 중심 좌표 계산
    const centerX = this.position.x + this.blocksize / 2;
    const centerY =
      this.position.y + (this.image.height * this.scaleFactor) / 1.4;

    // 중심점 그리기
    ctx.beginPath();
    ctx.arc(centerX, centerY, 1, 0, Math.PI * 2, false);
    ctx.fillStyle = "white";
    ctx.fill();

    // 끝나는 좌표
    const endX =
      centerX + radius * 1.5 * Math.cos(this.attack.angle * (Math.PI / 180));
    const endY =
      centerY + radius * 1.5 * Math.sin(this.attack.angle * (Math.PI / 180));
    this.attack.endX = endX;
    this.attack.endY = endY;
    console.log(this.attack.endX, this.attack.endY);

    // 무기 이미지 그리기
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.attack.angle * (Math.PI / 180)); // 각도를 라디안으로 변환하여 적용

    // 무기의 크기 조절
    const weaponWidth = this.weapon === "knife" ? radius * 1.5 : radius * 1.1; // 무기 이미지의 너비
    const weaponHeight = weaponWidth * (img.height / img.width);

    ctx.drawImage(img, 0, -weaponHeight / 2, weaponWidth, weaponHeight);
    ctx.restore();
  }

  private drawHealth() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(
      this.position.x,
      this.position.y - 10,
      (this.image.width / 4) * this.scaleFactor,
      10,
    );
    ctx.fillStyle = "green";
    ctx.fillRect(
      this.position.x,
      this.position.y - 10,
      ((this.image.width / 4) * this.scaleFactor * this.health) / 100,
      10,
    );
  }
}

export default Sprite;
