import Sprite from "../classes/Sprite";

function makeAvatars(
  positions: { [key: string]: { x: number; y: number } },
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  scaleFactor: number,
  sprites: { [key: string]: HTMLImageElement },
): Sprite[] {
  return Object.entries(positions).map(([nickname, position]) => {
    return new Sprite({
      canvas: canvas,
      image: image,
      position: position,
      scaleFactor: scaleFactor,
      sprites: sprites,
      nickname: nickname,
    });
  });
}

export default makeAvatars;
