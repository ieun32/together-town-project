import Sprite from "../classes/Sprite";
import { usersType } from "../types/utils";

/**
 * 기존 좌표를 변환 대상 블록 사이즈에 맞게 변환하는 함수
 * @param {number} x 상대 좌표 x
 * @param {number} y 상대 좌표 y
 * @param {number} absoluteX 절대 좌표 x
 * @param {number} absoluteY 절대 좌표 y
 * @param {number} endX 공격 좌표 x
 * @param {number} endY 공격 좌표 y
 * @param {number} fromBlockSize 기존 블록 사이즈
 * @param {number} toBlockSize 변환 대상 블록 사이즈
 * @returns {object} 변환된 좌표
 */
const convertPosition = (
  x: number,
  y: number,
  absoluteX: number,
  absoluteY: number,
  endX: number,
  endY: number,
  fromBlockSize: number,
  toBlockSize: number,
): {
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
  endX: number;
  endY: number;
} => {
  const ratio = toBlockSize / fromBlockSize;
  return {
    x: x * ratio,
    y: y * ratio,
    absoluteX: absoluteX * ratio,
    absoluteY: absoluteY * ratio,
    endX: endX * ratio,
    endY: endY * ratio,
  };
};

/**
 * 절대 좌표를 상대 좌표로 변환하는 함수
 * @param {Sprite} me 내 캐릭터 인스턴스
 * @param {Sprite} other 다른 유저 인스턴스
 * @returns {Sprite} 상대 좌표로 변환한 인스턴스
 */
const convertAbsolutePosition = (me: Sprite, other: Sprite) => {
  if (!me.canvas) return other;
  const canvasMinX = me.position.absoluteX - me.blocksize * 5;
  const canvasMinY = me.position.absoluteY - me.blocksize * 4.6;

  const relativeX = other.position.absoluteX - canvasMinX;
  const relativeY = other.position.absoluteY - canvasMinY;

  if (
    relativeX >= 0 &&
    relativeX <= me.canvas.width &&
    relativeY >= 0 &&
    relativeY <= me.canvas.height
  ) {
    return new Sprite({
      canvas: other.canvas,
      image: other.image,
      position: {
        x: relativeX,
        y: relativeY,
        absoluteX: other.position.absoluteX,
        absoluteY: other.position.absoluteY,
      },
      sprites: other.sprites,
      scaleFactor: other.scaleFactor,
      nickname: other.nickname,
      blocksize: other.blocksize,
      weapon: other.weapon,
      attack: other.attack,
      health: other.health,
    });
  } else {
    return null;
  }
};

const convertAndMakeSprite = (me: Sprite, other: usersType) => {
  const { x, y, absoluteX, absoluteY, endX, endY } = convertPosition(
    other.position.x,
    other.position.y,
    other.position.absoluteX,
    other.position.absoluteY,
    other.attack.endX,
    other.attack.endY,
    other.blocksize,
    me.blocksize,
  );

  const directionImage: { [key: string]: HTMLImageElement } = {
    ArrowUp: me.sprites.up,
    ArrowDown: me.sprites.down,
    ArrowLeft: me.sprites.left,
    ArrowRight: me.sprites.right,
  };

  const tempSprite = new Sprite({
    canvas: me.canvas,
    image: directionImage[other.direction],
    position: { x, y, absoluteX, absoluteY },
    sprites: me.sprites,
    scaleFactor: me.scaleFactor,
    nickname: other.nickname,
    blocksize: me.blocksize,
    weapon: other.weapon,
    attack: { ...other.attack, endX, endY },
    health: other.health,
  });

  return convertAbsolutePosition(me, tempSprite);
};

export { convertPosition, convertAbsolutePosition, convertAndMakeSprite };
