import Sprite from "../classes/Sprite";
import Boundary from "../classes/Boundary";
import _WebSocket from "../classes/WebSocket";
import Background from "../classes/Background";

type Position = {
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
};

type BoundaryType = {
  canvas: HTMLCanvasElement;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

type SpriteType = {
  canvas: HTMLCanvasElement | null;
  position: Position;
  image: HTMLImageElement;
  sprites: { [key: string]: HTMLImageElement };
  scaleFactor: number;
  nickname: string;
  cursor?: { x: number; y: number };
  blocksize: number;
  weapon: string | null;
};

type KeyDownHandlerType = {
  keyRef: React.MutableRefObject<string | null>;
  blocksize: number;
  avatar: Sprite | null;
  background: Background | null;
  boundaries: Boundary[];
  websocket: _WebSocket | null;
  usersRef: React.RefObject<usersType | null>;
  checkCollision: (
    avatar: Sprite,
    nextPosition: {
      x: number;
      y: number;
      absoluteX: number;
      absoluteY: number;
    },
    boundaries: Boundary[],
    others: usersType | null,
  ) => boolean;
};

type KeyUpHandlerType = {
  keyRef: React.MutableRefObject<string | null>;
  avatar: Sprite | null;
};

type usersType = {
  [key: string]: {
    nickname: string;
    position: { x: number; y: number; absoluteX: number; absoluteY: number };
    direction: string;
    blocksize: number;
    weapon: string;
  };
};

export {
  Position,
  BoundaryType,
  SpriteType,
  KeyDownHandlerType,
  KeyUpHandlerType,
  usersType,
};
