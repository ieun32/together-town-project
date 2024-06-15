import React from "react";

import images from "../constants/images";
import player from "../assets/images/playerDown.png";

import useCanvas from "../hooks/useCanvas";

import Sprite from "../classes/Sprite";
import Boundary from "../classes/Boundary";
import Background from "../classes/Background";
import animate from "../functions/animate";
import nicknameHandler from "../functions/nicknamehandler";
import {
  mouseMoveAndDownHandler,
  onlyMouseMoveHandler,
} from "../functions/mouseMoveHandler";
import { keyDownHandler, keyUpHandler } from "../functions/keyHandlers";
import { makeBoundaries, checkCollision } from "../functions/collision";
import {
  setSessionNickname,
  getSessionNickname,
  getSessionWeapon,
} from "../functions/sessionStorage";

import { usersType } from "../types/utils";
import _WebSocket from "../classes/WebSocket";

const Canvas = ({
  setIsDead,
}: {
  setIsDead: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // 배경 이미지 x: 25, y: 15 비율로 설정
  // 캔버스 크기 블록 단위 11 x 11로 설정
  const CANVAS_WIDTH = window.innerWidth / 2;
  const CANVAS_HEIGHT = CANVAS_WIDTH;
  const BLOCK_SIZE = CANVAS_WIDTH / 11;
  const SCALE_FACTOR = (BLOCK_SIZE / 40) * 0.8;

  const avatarRef = React.useRef<Sprite | null>(null);
  const lastKeyRef = React.useRef<string | null>(null);
  const boundariesRef = React.useRef<Boundary[]>([]);
  const backgroundRef = React.useRef<Background | null>(null);
  const nicknameRef = React.useRef<string>("player");
  const websocketRef = React.useRef<_WebSocket | null>(null);
  const usersRef = React.useRef<usersType[]>([]);
  const weaponRef = React.useRef<string | null>(getSessionWeapon());
  const isMouseDownRef = React.useRef<boolean>(false);
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
      const x = CANVAS_WIDTH / 2 - (playerImage.width * SCALE_FACTOR) / 8;
      const y =
        CANVAS_HEIGHT / 2 - playerImage.height * SCALE_FACTOR + BLOCK_SIZE / 2;
      const absoluteX = x + BLOCK_SIZE * 3;
      const absoluteY = y + BLOCK_SIZE * 10;

      avatarRef.current = new Sprite({
        canvas: canvasRef.current as HTMLCanvasElement,
        image: playerImage,
        position: {
          x: x,
          y: y,
          absoluteX: absoluteX,
          absoluteY: absoluteY,
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
        attack: { state: false, endX: 0, endY: 0, angle: 0 },
        health: 100,
      });

      backgroundRef.current = new Background({
        canvas: canvasRef.current as HTMLCanvasElement,
        image: images.mapImage,
        position: { x: -BLOCK_SIZE * 3, y: -BLOCK_SIZE * 10 },
      });

      websocketRef.current = new _WebSocket(avatarRef.current, BLOCK_SIZE);

      websocketRef.current.open();
      websocketRef.current.socket?.addEventListener("message", (message) => {
        const parsed = JSON.parse(message.data);
        switch (parsed.type) {
          case "message":
            console.log(parsed.data);
            break;
          case "update_positions":
            // 내 캐릭터 정보가 포함되었을 경우 health 정보 체크 및 업데이트
            parsed.data.forEach((user: usersType) => {
              if (user.nickname === avatarRef.current?.nickname) {
                if (!avatarRef.current) return;
                avatarRef.current.health = user.health;
              }
            });
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
        setIsDead,
        websocketRef.current,
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
        websocket: websocketRef.current,
      });

    const mouseMoveListener = () =>
      mouseMoveAndDownHandler(
        avatarRef.current,
        lastKeyRef,
        isMouseDownRef.current,
        websocketRef.current,
        usersRef,
      );

    isMouseDownRef.current = false;

    const mouseDown = () => {
      isMouseDownRef.current = true;
      window.addEventListener("mousemove", mouseMoveListener);
    };

    const mouseUp = () => {
      isMouseDownRef.current = false;
      window.removeEventListener("mousemove", mouseMoveListener);
      if (!avatarRef.current || !websocketRef.current || !lastKeyRef.current)
        return;
      avatarRef.current.attack.state = false;
      websocketRef.current.send_avatar_info(
        avatarRef.current,
        lastKeyRef.current,
      );
    };

    const mouseMove = (e: MouseEvent) => {
      onlyMouseMoveHandler(
        e,
        avatarRef.current,
        mousePositionRef.current,
        lastKeyRef,
      );
    };

    window.addEventListener("keydown", (e) => KeyDown(e));
    window.addEventListener("keyup", () => KeyUp());
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("keydown", (e) => KeyDown(e));
      window.removeEventListener("keyup", () => KeyUp());
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mousemove", mouseMove);
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
