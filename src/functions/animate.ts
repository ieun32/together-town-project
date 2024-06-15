import Boundary from "../classes/Boundary";
import Sprite from "../classes/Sprite";
import Background from "../classes/Background";
import { convertAndMakeSprite } from "./convertPosition";
import { usersType } from "../types/utils";
import _WebSocket from "../classes/WebSocket";

/**
 * 애니메이션 함수
 * @param {HTMLCanvasElement} canvas 캔버스 엘리먼트
 * @param {Background} background 맵 인스턴스
 * @param {Sprite} avatar 아바타 스프라이트 인스턴스
 * @param {usersType} usersRef 다른 유저 정보
 * @param {Boundary[]} boundaries 충돌 좌표 인스턴스들
 * @param {number} blocksize 한 블록의 크기
 * @param {boolean} setIsDead 게임 종료 여부
 * @param {_WebSocket} websocket 웹소켓 객체
 */
const animate = (
  canvas: HTMLCanvasElement | null,
  background: Background,
  avatar: Sprite,
  usersRef: React.MutableRefObject<usersType[]>,
  boundaries: Boundary[],
  blocksize: number,
  setIsDead: React.Dispatch<React.SetStateAction<boolean>>,
  websocket: _WebSocket | null,
): void => {
  window.requestAnimationFrame(() =>
    animate(
      canvas,
      background,
      avatar,
      usersRef,
      boundaries,
      blocksize,
      setIsDead,
      websocket,
    ),
  );

  if (!canvas) return;
  if (!avatar) return;
  if (!boundaries) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 체력이 0 이하이면 웹소켓 통신 종료 및 첫화면 이동
  if (avatar.health && avatar.health <= 0) {
    if (!websocket) return;
    if (websocket.socket?.readyState === 1) {
      websocket.socket.close();
    }
    setIsDead(true);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
  avatar.draw();
  boundaries.forEach((boundary) => {
    boundary.draw({ transparent: 0 });
  });

  const users = [...usersRef.current];
  if (!users || users.length === 0) return;

  users.forEach((user: usersType) => {
    if (!user) return;
    if (user.nickname === avatar.nickname) return;
    const newOther = convertAndMakeSprite(avatar, user);
    if (!newOther) return;
    newOther.draw();
  });
};

export default animate;
