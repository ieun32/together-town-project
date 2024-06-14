import Sprite from "../classes/Sprite";

const mouseMoveHandler = (
  e: MouseEvent,
  sprite: Sprite | null,
  mousePositionRef: { x: number; y: number },
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

  sprite.cursor.x = mouseX;
  sprite.cursor.y = mouseY;
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

export default mouseMoveHandler;
