import React from "react";

import images from "../constants/images";
import player from "../assets/images/playerDown.png";

import useCanvas from "../hooks/useCanvas";

import Sprite from "../utils/classes/Sprite";
import Boundary from "../utils/classes/Boundary";
import animate from "../utils/functions/animate";
import nicknameHandler from "../utils/functions/nicknamehandler";
import { keyDownHandler, keyUpHandler } from "../utils/functions/keyHandlers";
import { makeBoundaries, checkCollusion } from "../utils/functions/collusion";

import { usersType } from "../types/utils";
import _WebSocket from "../utils/classes/WebSocket";

const Canvas = () => {
  // 배경 이미지 x: 25, y: 15 비율로 설정
  const CANVAS_WIDTH = window.innerWidth - 20;
  const CANVAS_HEIGHT = (CANVAS_WIDTH / 25) * 15;
  const BLOCK_SIZE = CANVAS_WIDTH / 25;
  const SCALE_FACTOR = (BLOCK_SIZE / 40) * 0.8;

  const avatarRef = React.useRef<Sprite | null>(null);
  const lastKeyRef = React.useRef<string | null>(null);
  const boundariesRef = React.useRef<Boundary[]>([]);
  const nicknameRef = React.useRef<string>("player");
  const websocketRef = React.useRef<_WebSocket | null>(null);
  const usersRef = React.useRef<usersType | null>(null);

  const canvasRef = useCanvas((canvas) => {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    lastKeyRef.current = "";
    boundariesRef.current = makeBoundaries(canvas, BLOCK_SIZE);

    const playerImage = new Image();
    playerImage.src = player;

    playerImage.onload = () => {
      avatarRef.current = new Sprite({
        canvas: canvasRef.current as HTMLCanvasElement,
        image: playerImage,
        position: {
          x: BLOCK_SIZE,
          y: BLOCK_SIZE - (playerImage.height * SCALE_FACTOR) / 4,
        },
        sprites: {
          up: images.playerUpImage,
          down: images.playerDownImage,
          left: images.playerLeftImage,
          right: images.playerRightImage,
        },
        scaleFactor: SCALE_FACTOR,
        nickname: nicknameRef.current || "player",
      });

      const ws = new _WebSocket(avatarRef.current as Sprite, BLOCK_SIZE);
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
            break;
          default:
            break;
        }
      });

      animate(
        canvasRef.current as HTMLCanvasElement,
        images.mapImage,
        avatarRef.current,
        usersRef,
        boundariesRef.current,
      );
    };

    window.addEventListener("keydown", (e) =>
      keyDownHandler(e, {
        keyRef: lastKeyRef,
        blocksize: BLOCK_SIZE,
        avatar: avatarRef.current,
        usersRef: usersRef,
        boundaries: boundariesRef.current,
        websocket: websocketRef.current,
        checkCollusion,
      }),
    );

    window.addEventListener("keyup", () =>
      keyUpHandler({
        keyRef: lastKeyRef,
        avatar: avatarRef.current,
      }),
    );
  });

  React.useEffect(() => {
    return () => {
      window.removeEventListener("keydown", (e) =>
        keyDownHandler(e, {
          keyRef: lastKeyRef,
          blocksize: BLOCK_SIZE,
          avatar: avatarRef.current,
          usersRef: usersRef,
          boundaries: boundariesRef.current,
          websocket: websocketRef.current,
          checkCollusion,
        }),
      );

      window.removeEventListener("keyup", () =>
        keyUpHandler({
          keyRef: lastKeyRef,
          avatar: avatarRef.current,
        }),
      );
    };
  }, []);

  return (
    <main>
      <button
        className="nickname-button"
        onClick={() =>
          nicknameHandler(
            avatarRef.current as Sprite,
            nicknameRef,
            websocketRef.current as _WebSocket,
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
