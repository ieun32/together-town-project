import React from "react";

import images from "../constants/images";
import player from "../assets/images/playerDown.png";

import useCanvas from "../hooks/useCanvas";

import Sprite from "../classes/Sprite";
import Boundary from "../classes/Boundary";
import Background from "../classes/Background";
import animate from "../functions/animate";
import nicknameHandler from "../functions/nicknamehandler";
import mouseMoveHandler from "../functions/mouseMoveHandler";
import {
  mouseDownHandler,
  mouseUpHandler,
} from "../functions/mouseClickhandler";
import { keyDownHandler, keyUpHandler } from "../functions/keyHandlers";
import { makeBoundaries, checkCollision } from "../functions/collision";
import {
  setSessionNickname,
  getSessionNickname,
  getSessionWeapon,
} from "../functions/sessionStorage";

import { usersType } from "../types/utils";
import _WebSocket from "../classes/WebSocket";

const Canvas = () => {
  // 배경 이미지 x: 25, y: 15 비율로 설정
  const CANVAS_WIDTH = window.innerWidth / 2;
  const CANVAS_HEIGHT = (CANVAS_WIDTH / 11) * 11;
  const BLOCK_SIZE = CANVAS_WIDTH / 11;
  const SCALE_FACTOR = (BLOCK_SIZE / 40) * 0.8;

  const avatarRef = React.useRef<Sprite | null>(null);
  const lastKeyRef = React.useRef<string | null>(null);
  const boundariesRef = React.useRef<Boundary[]>([]);
  const backgroundRef = React.useRef<Background | null>(null);
  const nicknameRef = React.useRef<string>("player");
  const websocketRef = React.useRef<_WebSocket | null>(null);
  const usersRef = React.useRef<usersType | null>(null);
  const weaponRef = React.useRef<string | null>(getSessionWeapon());
  const mousePositionRef = React.useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const canvasRef = useCanvas((canvas) => {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    lastKeyRef.current = "";
    boundariesRef.current = makeBoundaries(canvas, BLOCK_SIZE);

    const playerImage = new Image();
    playerImage.src = player;

    nicknameRef.current = getSessionNickname() || "player";

    playerImage.onload = () => {
      avatarRef.current = new Sprite({
        canvas: canvasRef.current as HTMLCanvasElement,
        image: playerImage,
        position: {
          x: CANVAS_WIDTH / 2 - (playerImage.width * SCALE_FACTOR) / 8,
          y: CANVAS_HEIGHT / 2 - playerImage.height * SCALE_FACTOR + 20,
          absoluteX:
            CANVAS_WIDTH / 2 -
            (playerImage.width * SCALE_FACTOR) / 8 +
            BLOCK_SIZE * 3,
          absoluteY:
            CANVAS_HEIGHT / 2 -
            playerImage.height * SCALE_FACTOR +
            20 +
            BLOCK_SIZE * 10,
        },
        sprites: {
          up: images.playerUpImage,
          down: images.playerDownImage,
          left: images.playerLeftImage,
          right: images.playerRightImage,
        },
        scaleFactor: SCALE_FACTOR,
        nickname: nicknameRef.current,
        blocksize: BLOCK_SIZE,
        weapon: weaponRef.current,
      });

      const background = new Background({
        canvas: canvasRef.current as HTMLCanvasElement,
        image: images.mapImage,
        position: { x: -BLOCK_SIZE * 3, y: -BLOCK_SIZE * 10 },
      });

      backgroundRef.current = background;

      const ws = new _WebSocket(avatarRef.current, BLOCK_SIZE);
      websocketRef.current = ws;

      ws.open();
      ws.socket?.addEventListener("message", (message) => {
        const parsed = JSON.parse(message.data);
        switch (parsed.type) {
          case "message":
            console.log(parsed.data);
            break;
          case "update_positions":
            usersRef.current = parsed.data;
            console.log(usersRef.current);
            break;
          default:
            break;
        }
      });

      animate(
        canvasRef.current,
        backgroundRef.current,
        avatarRef.current,
        usersRef,
        boundariesRef.current,
        BLOCK_SIZE,
      );
    };

    const KeyDown = (e: KeyboardEvent) =>
      keyDownHandler(e, {
        keyRef: lastKeyRef,
        blocksize: BLOCK_SIZE,
        avatar: avatarRef.current,
        background: backgroundRef.current,
        usersRef: usersRef,
        boundaries: boundariesRef.current,
        websocket: websocketRef.current,
        checkCollision,
      });

    const KeyUp = () =>
      keyUpHandler({
        keyRef: lastKeyRef,
        avatar: avatarRef.current,
      });

    window.addEventListener("keydown", (e) => KeyDown(e));
    window.addEventListener("keyup", () => KeyUp());
    window.addEventListener("mousemove", (e) =>
      mouseMoveHandler(e, avatarRef.current, mousePositionRef.current),
    );
    window.addEventListener("mousedown", (e) =>
      mouseDownHandler(e, avatarRef.current),
    );

    window.addEventListener("mouseup", (e) =>
      mouseUpHandler(e, avatarRef.current),
    );

    return () => {
      window.removeEventListener("keydown", (e) => KeyDown(e));
      window.removeEventListener("keyup", () => KeyUp());
    };
  });

  return (
    <main>
      <button
        className="nickname-button"
        onClick={() =>
          nicknameHandler(
            avatarRef.current,
            nicknameRef,
            websocketRef.current,
            setSessionNickname,
          )
        }
      >
        닉네임 변경하기
      </button>
      <canvas ref={canvasRef} />
    </main>
  );
};

export default Canvas;
