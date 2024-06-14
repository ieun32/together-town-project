import Sprite from "../classes/Sprite";

const mouseDownHandler = (event: MouseEvent, sprite: Sprite | null) => {
  if (!sprite) return;
  sprite.attack.state = true;
};

const mouseUpHandler = (event: MouseEvent, sprite: Sprite | null) => {
  if (!sprite) return;
  sprite.attack.state = false;
};

export { mouseDownHandler, mouseUpHandler };
