import Sprite from "../utils/classes/Sprite";
import Boundary from "../utils/classes/Boundary";
import _WebSocket from "../utils/classes/WebSocket";

type Position = {
  x: number;
  y: number;
};

type BoundaryType = {
  canvas: HTMLCanvasElement;
  position: Position;
  size: { width: number; height: number };
};

type SpriteType = {
  canvas: HTMLCanvasElement | null;
  position: Position;
  image: HTMLImageElement;
  sprites: { [key: string]: HTMLImageElement };
  scaleFactor: number;
  nickname: string;
};

type KeyDownHandlerType = {
  keyRef: React.MutableRefObject<string | null>;
  blocksize: number;
  avatar: Sprite | null;
  boundaries: Boundary[];
  websocket: _WebSocket | null;
  usersRef: React.RefObject<usersType | null>;
  checkCollusion: (
    avatar: Sprite,
    nextPosition: { x: number; y: number },
    boundaries: Boundary[],
    others: usersType,
  ) => boolean;
};

type KeyUpHandlerType = {
  keyRef: React.MutableRefObject<string | null>;
  avatar: Sprite | null;
};

type usersType = {
  [key: string]: {
    nickname: string;
    position: { x: number; y: number };
    direction: string;
    blocksize: number;
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
