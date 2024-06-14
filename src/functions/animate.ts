import Boundary from "../classes/Boundary";
import Sprite from "../classes/Sprite";
import Background from "../classes/Background";
import { convertAbsolutePosition, convertPosition } from "./convertPosition";
import { usersType } from "../types/utils";

/**
 * 애니메이션 함수
 * @param {HTMLCanvasElement} canvas 캔버스 엘리먼트
 * @param {Background} background 맵 인스턴스
 * @param {Sprite} avatar 아바타 스프라이트 인스턴스
 * @param {usersType} usersRef 다른 유저 정보
 * @param {Boundary[]} boundaries 충돌 좌표 인스턴스들
 * @param {number} blocksize 한 블록의 크기
 */
const animate = (
  canvas: HTMLCanvasElement | null,
  background: Background, // Add JSDoc @param type for mapImage
  avatar: Sprite,
  usersRef: React.RefObject<usersType | null>,
  boundaries: Boundary[],
  blocksize: number,
): void => {
  window.requestAnimationFrame(() =>
    animate(canvas, background, avatar, usersRef, boundaries, blocksize),
  );

  if (!canvas) return;
  if (!avatar) return;
  if (!boundaries) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
  avatar.draw();
  boundaries.forEach((boundary) => {
    boundary.draw({ transparent: 0 });
  });

  const users = usersRef.current;
  if (!users) return;

  const directionImage: { [key: string]: HTMLImageElement } = {
    ArrowUp: avatar.sprites.up,
    ArrowDown: avatar.sprites.down,
    ArrowLeft: avatar.sprites.left,
    ArrowRight: avatar.sprites.right,
  };

  const others: Sprite[] = [];
  Object.values(users).forEach((user) => {
    if (user === null) return;
    const { x, y, absoluteX, absoluteY } = convertPosition(
      // 한 칸의 크기를 비례하게 바꾸는 함수
      user.position.x,
      user.position.y,
      user.position.absoluteX,
      user.position.absoluteY,
      user.blocksize,
      canvas.width / 11,
    );
    others.push(
      new Sprite({
        canvas,
        position: {
          x,
          y,
          absoluteX,
          absoluteY,
        },
        image: directionImage[user.direction],
        sprites: avatar.sprites,
        scaleFactor: avatar.scaleFactor,
        nickname: user.nickname,
        blocksize,
        weapon: user.weapon,
      }),
    );
  });

  others.forEach((other) => {
    const converted = convertAbsolutePosition(avatar, other);
    converted.draw();
  });
};

export default animate;
