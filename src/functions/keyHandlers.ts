import { KeyDownHandlerType, KeyUpHandlerType } from "../types/utils";

const keyDownHandler = (
  e: KeyboardEvent,
  {
    keyRef,
    blocksize,
    avatar,
    background,
    usersRef,
    boundaries,
    websocket,
    checkCollision,
  }: KeyDownHandlerType,
) => {
  if (!keyRef) return;
  if (!avatar) return;
  if (!background) return;
  if (avatar.moving) return;

  avatar.moving = true;
  const nextPosition = { ...avatar.position };
  const nextBackPosition = { ...background.position };
  const nextBoundaryPosition = boundaries.map((boundary) => boundary.clone());

  switch (e.key) {
    case " ":
    case "Spacebar":
      avatar.attack.state = true;
      break;
    case "ArrowUp":
    case "W":
    case "w":
      nextPosition.absoluteY -= blocksize;
      nextBackPosition.y += blocksize;
      nextBoundaryPosition.forEach((boundary) => {
        boundary.position.y += blocksize;
      });
      keyRef.current = "ArrowUp";
      break;
    case "ArrowDown":
    case "S":
    case "s":
      nextPosition.absoluteY += blocksize;
      nextBackPosition.y -= blocksize;
      nextBoundaryPosition.forEach((boundary) => {
        boundary.position.y -= blocksize;
      });
      keyRef.current = "ArrowDown";
      break;
    case "ArrowLeft":
    case "A":
    case "a":
      nextPosition.absoluteX -= blocksize;
      nextBackPosition.x += blocksize;
      nextBoundaryPosition.forEach((boundary) => {
        boundary.position.x += blocksize;
      });
      keyRef.current = "ArrowLeft";
      break;
    case "ArrowRight":
    case "D":
    case "d":
      nextPosition.absoluteX += blocksize;
      nextBackPosition.x -= blocksize;
      nextBoundaryPosition.forEach((boundary) => {
        boundary.position.x -= blocksize;
      });
      keyRef.current = "ArrowRight";
      break;
    default:
      break;
  }

  const isCollision = checkCollision(
    avatar,
    nextPosition,
    nextBoundaryPosition,
    usersRef,
  );

  // 충돌 좌표와 다른 사용자와의 충돌을 확인하여 이동
  if (!isCollision) {
    avatar.position = nextPosition;
    background.position = nextBackPosition;
    boundaries.forEach((boundary, i) => {
      boundary.position = nextBoundaryPosition[i].position;
    });
    websocket?.send_avatar_info(avatar, keyRef.current as string);
  }
};

const keyUpHandler = ({ keyRef, avatar, websocket }: KeyUpHandlerType) => {
  if (!keyRef) return;
  if (!avatar) return;
  avatar.moving = false;
  avatar.attack.state = false;
  if (!websocket) return;
  websocket.send_avatar_info(avatar, keyRef.current as string);
};

export { keyDownHandler, keyUpHandler };
