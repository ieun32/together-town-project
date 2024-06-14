import Sprite from "../classes/Sprite";

/**
 *
 * @param canvas
 * @param image
 * @param scaleFactor
 * @param blocksize
 */
function makeAvatars(
  positions: {
    [key: string]: {
      x: number;
      y: number;
      absoluteX: number;
      absoluteY: number;
    };
  },
  weapon: { [key: string]: string },
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  scaleFactor: number,
  sprites: { [key: string]: HTMLImageElement },
  blocksize: number,
): Sprite[] {
  return Object.entries(positions).map(([nickname, position]) => {
    return new Sprite({
      canvas: canvas,
      image: image,
      position: position,
      scaleFactor: scaleFactor,
      sprites: sprites,
      nickname: nickname,
      blocksize: blocksize,
      weapon: weapon[nickname],
    });
  });
}

export default makeAvatars;
