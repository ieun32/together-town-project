import Sprite from "../classes/Sprite";
import _WebSocket from "../classes/WebSocket";
import attackHandler from "./attackHandler";
import { usersType } from "../types/utils";

const mouseMoveAndDownHandler = (
  sprite: Sprite | null,
  keyRef: React.MutableRefObject<string | null>,
  isMouseDown: boolean,
  websocket: _WebSocket | null,
  usersRef: React.MutableRefObject<usersType[]>,
) => {
  if (!sprite) return;
  if (!keyRef.current) return;

  if (isMouseDown) {
    sprite.attack.state = true;
    websocket?.send_avatar_info(sprite, keyRef.current);
    attackHandler(sprite, usersRef.current, websocket);
  }
};

const onlyMouseMoveHandler = (
  e: MouseEvent,
  sprite: Sprite | null,
  mousePositionRef: { x: number; y: number },
  keyRef: React.MutableRefObject<string | null>,
) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const dx = mouseX - window.innerWidth / 2;
  const dy = mouseY - window.innerHeight / 2;

  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  mousePositionRef.x = mouseX;
  mousePositionRef.y = mouseY;
  const angleToDirection = (angle: number) => {
    if (angle >= 135 || angle <= -135) return "left";
    if (angle >= -135 && angle <= -45) return "up";
    if (angle >= 45 && angle <= 135) return "down";
    if (angle >= -45 && angle <= 45) return "right";
  };

  if (!sprite) return;
  if (!keyRef.current) return;

  sprite.cursor.x = mouseX;
  sprite.cursor.y = mouseY;
  sprite.attack.angle = angle;
  switch (angleToDirection(angle)) {
    case "left":
      sprite.image = sprite.sprites.left;
      break;
    case "right":
      sprite.image = sprite.sprites.right;
      break;
    case "up":
      sprite.image = sprite.sprites.up;
      break;
    case "down":
      sprite.image = sprite.sprites.down;
      break;
    default:
      break;
  }
};

export { mouseMoveAndDownHandler, onlyMouseMoveHandler };
