import Sprite from "../classes/Sprite";

/**
 * 기존 좌표를 변환 대상 블록 사이즈에 맞게 변환하는 함수
 * @param {number} x 기존 x좌표
 * @param {number} y 기존 y좌표
 * @param absoluteX
 * @param absoluteY
 * @param {number} fromBlockSize 기존 블록 사이즈
 * @param {number} toBlockSize 변환 대상 블록 사이즈
 * @returns {object} 변환된 좌표
 */
const convertPosition = (
  x: number,
  y: number,
  absoluteX: number,
  absoluteY: number,
  fromBlockSize: number,
  toBlockSize: number,
): { x: number; y: number; absoluteX: number; absoluteY: number } => {
  const scaleFactor = toBlockSize / fromBlockSize;
  return {
    x: x * scaleFactor,
    y: y * scaleFactor,
    absoluteX: absoluteX * scaleFactor,
    absoluteY: absoluteY * scaleFactor,
  };
};

// 절대 좌표를 상대 좌표로 변환하는 함수
const convertAbsolutePosition = (me: Sprite, other: Sprite) => {
  const dx = other.position.absoluteX - me.position.absoluteX;
  const dy = other.position.absoluteY - me.position.absoluteY;
  const x = other.position.x + dx;
  const y = other.position.y + dy;

  console.log(other, x, y);

  return new Sprite({
    canvas: other.canvas,
    image: other.image,
    position: {
      x,
      y,
      absoluteX: other.position.absoluteX,
      absoluteY: other.position.absoluteY,
    },
    sprites: other.sprites,
    scaleFactor: other.scaleFactor,
    nickname: other.nickname,
    blocksize: other.blocksize,
    weapon: other.weapon,
  });
};

export { convertPosition, convertAbsolutePosition };
