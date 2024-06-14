import Boundary from "../classes/Boundary";
import Sprite from "../classes/Sprite";
import collisions from "../constants/collisions";
import { usersType } from "../types/utils";
import { convertPosition, convertAbsolutePosition } from "./convertPosition";

const collisionsMap: number[][] = [];
const boundaries: Boundary[] = [];

for (let i = 0; i < collisions.length; i += 80) {
  collisionsMap.push(collisions.slice(i, 80 + i));
}

/**
 * 충돌 좌표를 담은 배열을 반환하는 함수
 * @param canvas HTMLCanvasElement
 * @param size number
 * @returns boundaries Boundary[]
 */
const makeBoundaries = (canvas: HTMLCanvasElement, size: number) => {
  collisionsMap.forEach((row, i) => {
    row.forEach((collision, j) => {
      if (collision === 1025) {
        boundaries.push(
          new Boundary({
            canvas: canvas,
            position: { x: -size * 3 + j * size, y: -size * 10 + i * size },
            size: { width: size, height: size },
          }),
        );
      }
    });
  });
  return boundaries;
};

/**
 * 본인 좌표와 경계 좌표를 비교, 충돌 판정하는 함수
 * @param sprite Sprite 인스턴스
 * @param boundary Boundary 인스턴스
 * @returns boolean
 */
const rectangleCollision = (sprite: Sprite, boundary: Boundary) => {
  const iscollisionLX =
    sprite.position.x + 2 < boundary.position.x + boundary.size.width;
  const iscollisionRX =
    sprite.position.x + (sprite.image.width * sprite.scaleFactor) / 4 >
    boundary.position.x;
  const iscollisionTY =
    sprite.position.y + (sprite.image.height / 2) * sprite.scaleFactor <
    boundary.position.y + boundary.size.height;
  const iscollisionBY =
    sprite.position.y + (sprite.image.height * sprite.scaleFactor) / 2 >
    boundary.position.y;
  return iscollisionLX && iscollisionRX && iscollisionTY && iscollisionBY;
};

/**
 * 본인 좌표와 다른 유저의 좌표를 비교, 충돌 판정하는 함수
 * @param sprite 본인 캐릭터 인스턴스
 * @param others 다른 유저들의 좌표
 * @returns boolean
 */
const avatarCollision = (sprite: Sprite, others: usersType): boolean => {
  let iscollision = false;

  for (const other of Object.values(others)) {
    if (!sprite.canvas) return false;
    const { x, y } = convertPosition(
      other.position.x,
      other.position.y,
      other.position.absoluteX,
      other.position.absoluteY,
      other.blocksize,
      sprite.canvas.width / 25,
    );

    other.position.x = x;
    other.position.y = y;

    const tempSprite = new Sprite({
      canvas: sprite.canvas,
      image: sprite.image,
      position: other.position,
      sprites: sprite.sprites,
      scaleFactor: sprite.scaleFactor,
      nickname: other.nickname,
      blocksize: sprite.blocksize,
      weapon: other.weapon,
    });

    const newOther = convertAbsolutePosition(sprite, tempSprite);
    const newX = newOther.position.x;
    const newY = newOther.position.y;

    const tempWidth = sprite.image.width * sprite.scaleFactor;
    const tempHeight = sprite.image.height * sprite.scaleFactor;
    const iscollisionLX = sprite.position.x + 2 < newX + tempWidth / 4;
    const iscollisionRX = sprite.position.x + tempWidth / 4 > newX;
    const iscollisionTY =
      sprite.position.y + (sprite.image.height / 2) * sprite.scaleFactor <
      newY + tempHeight;
    const iscollisionBY = sprite.position.y + tempHeight / 2 > newY;

    if (iscollisionLX && iscollisionRX && iscollisionTY && iscollisionBY) {
      iscollision = true;
      break;
    }
  }
  return iscollision;
};

/**
 * 경계 좌표와 이동하려는 좌표를 비교, 충돌 판정하는 함수
 * @param sprite 본인 캐릭터 인스턴스
 * @param nextPosition 이동하려는 좌표
 * @param nextPosition.x
 * @param boundaries 경계 좌표 배열
 * @param nextPosition.y
 * @param others
 * @param nextPosition.absoluteX
 * @param nextPosition.absoluteY
 * @returns boolean
 */
const checkCollision = (
  sprite: Sprite,
  nextPosition: { x: number; y: number; absoluteX: number; absoluteY: number },
  boundaries: Boundary[],
  others: usersType | null,
) => {
  const tempSprite = new Sprite({
    canvas: sprite.canvas,
    image: sprite.image,
    position: nextPosition,
    sprites: sprite.sprites,
    scaleFactor: sprite.scaleFactor,
    nickname: sprite.nickname,
    blocksize: sprite.blocksize,
    weapon: sprite.weapon,
  });

  // 경계와 충돌 판정
  for (const boundary of boundaries) {
    if (rectangleCollision(tempSprite, boundary)) {
      return true;
    }
  }

  // 다른 유저와 충돌 판정
  if (others) {
    if (avatarCollision(tempSprite, others)) {
      return true;
    }
  }
  // 경계나 다른 유저와 충돌하지 않을 경우 false 반환
  return false;
};

export { makeBoundaries, rectangleCollision, avatarCollision, checkCollision };