import Boundary from "../classes/Boundary";
import Sprite from "../classes/Sprite";
import collusions from "../../constants/collusions";
import { usersType } from "../../types/utils";
import convertPosition from "./convertPosition";

const collusionsMap: number[][] = [];
const boundaries: Boundary[] = [];

for (let i = 0; i < collusions.length; i += 25) {
  collusionsMap.push(collusions.slice(i, 25 + i));
}

/**
 * 충돌 좌표를 담은 배열을 반환하는 함수
 * @param canvas HTMLCanvasElement
 * @param size number
 * @returns boundaries Boundary[]
 */
const makeBoundaries = (canvas: HTMLCanvasElement, size: number) => {
  collusionsMap.forEach((row, i) => {
    row.forEach((collusion, j) => {
      if (collusion === 1025) {
        boundaries.push(
          new Boundary({
            canvas: canvas,
            position: { x: j * size, y: i * size },
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
const rectangleCollusion = (sprite: Sprite, boundary: Boundary) => {
  const isCollusionLX =
    sprite.position.x + 2 < boundary.position.x + boundary.size.width;
  const isCollusionRX =
    sprite.position.x + (sprite.image.width * sprite.scaleFactor) / 4 >
    boundary.position.x;
  const isCollusionTY =
    sprite.position.y + 20 * sprite.scaleFactor <
    boundary.position.y + boundary.size.height;
  const isCollusionBY =
    sprite.position.y + (sprite.image.height * sprite.scaleFactor) / 2 >
    boundary.position.y;
  if (isCollusionLX && isCollusionRX && isCollusionTY && isCollusionBY) {
    return true;
  } else {
    return false;
  }
};

/**
 * 본인 좌표와 다른 유저의 좌표를 비교, 충돌 판정하는 함수
 * @param sprite 본인 캐릭터 인스턴스
 * @param others 다른 유저들의 좌표
 * @returns boolean
 */
const avatarCollusion = (sprite: Sprite, others: usersType): boolean => {
  let isCollusion = false;

  for (const other of Object.values(others)) {
    if (!sprite.canvas) return false;
    const { x, y } = convertPosition(
      other.position.x,
      other.position.y,
      other.blocksize,
      sprite.canvas.width / 25,
    );

    const tempWidth = sprite.image.width * sprite.scaleFactor;
    const tempHeight = sprite.image.height * sprite.scaleFactor;
    const isCollusionLX = sprite.position.x + 2 < x + tempWidth / 4;
    const isCollusionRX = sprite.position.x + tempWidth / 4 > x;
    const isCollusionTY =
      sprite.position.y + 20 * sprite.scaleFactor < y + tempHeight;
    const isCollusionBY = sprite.position.y + tempHeight / 2 > y;

    if (isCollusionLX && isCollusionRX && isCollusionTY && isCollusionBY) {
      isCollusion = true;
      break;
    }
  }
  return isCollusion;
};

/**
 * 경계 좌표와 이동하려는 좌표를 비교, 충돌 판정하는 함수
 * @param sprite 본인 캐릭터 인스턴스
 * @param nextPosition 이동하려는 좌표
 * @param boundaries 경계 좌표 배열
 * @returns boolean
 */
const checkCollusion = (
  sprite: Sprite,
  nextPosition: { x: number; y: number },
  boundaries: Boundary[],
  others: usersType,
) => {
  const tempSprite = new Sprite({
    canvas: sprite.canvas,
    image: sprite.image,
    position: nextPosition,
    sprites: sprite.sprites,
    scaleFactor: sprite.scaleFactor,
    nickname: sprite.nickname,
  });

  // 경계와 충돌 판정
  for (const boundary of boundaries) {
    if (rectangleCollusion(tempSprite, boundary)) {
      return true;
    }
  }

  // 다른 유저와 충돌 판정
  if (avatarCollusion(tempSprite, others)) {
    return true;
  }

  // 경계나 다른 유저와 충돌하지 않을 경우 false 반환
  return false;
};

export { makeBoundaries, rectangleCollusion, avatarCollusion, checkCollusion };
