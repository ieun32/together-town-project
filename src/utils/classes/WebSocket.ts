import Sprite from "./Sprite";
import { usersType } from "../../types/utils";

/**
 * 웹소켓 클래스
 * @class _WebSocket
 * @property {number} blocksize 블록 크기
 * @property {Sprite} avatar 캐릭터 스프라이트
 * @property {WebSocket | null} socket 웹소켓 객체
 * @property {usersType | null} users 다른 사용자 정보
 * @method open 웹소켓 연결
 * @method send_nickname 닉네임 전송
 * @method send_avatar_info 캐릭터 정보 전송
 * @method makeMessage 메시지 생성
 * @return {void}
 */
class _WebSocket {
  public blocksize: number;
  public avatar: Sprite;
  public socket: WebSocket | null;
  public users: usersType | null;
  constructor(avatar: Sprite, blocksize: number) {
    this.blocksize = blocksize;
    this.avatar = avatar;
    this.socket = null;
    this.users = null;
  }

  /**
   * 웹소켓 연결
   */
  public open() {
    const nickname = this.avatar.nickname;
    const position = this.avatar.position;
    const direction = "ArrowDown";
    const blocksize = this.blocksize;
    const userInfo = {
      nickname,
      position,
      direction,
      blocksize,
    };

    const socket = new WebSocket(`ws://${window.location.host}`);
    this.socket = socket;

    socket.addEventListener("open", () => {
      console.log("connected to server ✅");
      socket.send(this.makeMessage("user_info", userInfo));
    });

    socket.addEventListener("close", () => {
      console.log("disconnected from server ⚡");
    });
  }

  public send_nickname(nickname: string) {
    this.socket?.send(this.makeMessage("nickname", { nickname }));
  }

  public send_avatar_info(avatar: Sprite, direction: string) {
    const { position } = avatar;
    this.socket?.send(
      this.makeMessage("avatar_info", {
        position,
        direction,
      }),
    );
  }

  private makeMessage(type: string, data: object) {
    return JSON.stringify({ type, data });
  }
}

export default _WebSocket;
