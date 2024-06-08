import Boundary from "../classes/Boundary";
import Sprite from "../classes/Sprite";
import convertPosition from "./convertPosition";
import { usersType } from "../../types/utils";

/**
 * 애니메이션 함수
 * @param canvas HTMLCanvasElement
 * @param mapImage HTMLImageElement
 * @param sprite Sprite
 * @param boundaries Boundary[]
 * @returns void
 */
const animate = (
  canvas: HTMLCanvasElement | null,
  mapImage: HTMLImageElement,
  avatar: Sprite,
  usersRef: React.RefObject<usersType | null>,
  boundaries: Boundary[],
): void => {
  window.requestAnimationFrame(() =>
    animate(canvas, mapImage, avatar, usersRef, boundaries),
  );

  if (!canvas) return;
  if (!avatar) return;
  if (!boundaries) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
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

  Object.values(users).forEach((user) => {
    if (user === null) return;
    const { x, y } = convertPosition(
      user.position.x,
      user.position.y,
      user.blocksize,
      canvas.width / 25,
    );
    new Sprite({
      canvas,
      position: { x, y },
      image: directionImage[user.direction],
      sprites: avatar.sprites,
      scaleFactor: avatar.scaleFactor,
      nickname: user.nickname,
    }).draw();
  });
};

export default animate;
