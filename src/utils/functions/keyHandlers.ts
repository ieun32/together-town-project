import { KeyDownHandlerType, KeyUpHandlerType } from "../../types/utils";

const keyDownHandler = (
  e: KeyboardEvent,
  {
    keyRef,
    blocksize,
    avatar,
    usersRef,
    boundaries,
    websocket,
    checkCollusion,
  }: KeyDownHandlerType,
) => {
  if (!keyRef) return;
  if (!avatar) return;
  if (!usersRef.current) return;
  if (avatar.moving) return;

  avatar.moving = true;
  const nextPosition = { ...avatar.position };
  switch (e.key) {
    case "ArrowUp":
      nextPosition.y -= blocksize;
      avatar.image = avatar.sprites.up;
      keyRef.current = "ArrowUp";
      break;
    case "ArrowDown":
      nextPosition.y += blocksize;
      avatar.image = avatar.sprites.down;
      keyRef.current = "ArrowDown";
      break;
    case "ArrowLeft":
      nextPosition.x -= blocksize;
      avatar.image = avatar.sprites.left;
      keyRef.current = "ArrowLeft";
      break;
    case "ArrowRight":
      nextPosition.x += blocksize;
      avatar.image = avatar.sprites.right;
      keyRef.current = "ArrowRight";
      break;
    default:
      break;
  }

  const isCollusion = checkCollusion(
    avatar,
    nextPosition,
    boundaries,
    usersRef.current,
  );

  // 충돌 좌표와 다른 사용자와의 충돌을 확인하여 이동
  if (!isCollusion) {
    avatar.position = nextPosition;
    websocket?.send_avatar_info(avatar, keyRef.current as string);
  }
};

const keyUpHandler = ({ keyRef, avatar }: KeyUpHandlerType) => {
  if (!keyRef) return;
  if (!avatar) return;
  keyRef.current = "";
  avatar.moving = false;
};

export { keyDownHandler, keyUpHandler };
