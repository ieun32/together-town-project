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
  attack: { state: boolean; endX: number; endY: number; angle: number };
  health?: number;
};

type KeyDownHandlerType = {
  keyRef: React.MutableRefObject<string | null>;
  blocksize: number;
  avatar: Sprite | null;
  background: Background | null;
  boundaries: Boundary[];
  websocket: _WebSocket | null;
  usersRef: React.MutableRefObject<usersType[]>;
  checkCollision: (
    avatar: Sprite,
    nextPosition: {
      x: number;
      y: number;
      absoluteX: number;
      absoluteY: number;
    },
    boundaries: Boundary[],
    others: React.MutableRefObject<usersType[]>,
  ) => boolean;
};

type KeyUpHandlerType = {
  keyRef: React.MutableRefObject<string | null>;
  avatar: Sprite | null;
  websocket: _WebSocket | null;
};

type usersType = {
  nickname: string;
  position: { x: number; y: number; absoluteX: number; absoluteY: number };
  direction: string;
  blocksize: number;
  weapon: string;
  attack: { state: boolean; endX: number; endY: number; angle: number };
  health: number;
  cursor: { x: number; y: number };
};

export {
  Position,
  BoundaryType,
  SpriteType,
  KeyDownHandlerType,
  KeyUpHandlerType,
  usersType,
};
