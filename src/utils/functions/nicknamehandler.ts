import Sprite from "../classes/Sprite";
import _WebSocket from "../classes/WebSocket";

const nicknameHandler = (
  avatar: Sprite | null,
  nickname: React.MutableRefObject<string>,
  ws: _WebSocket | null,
) => {
  const newNickname = prompt("새로운 닉네임을 입력해주세요", nickname.current);
  if (newNickname) {
    nickname.current = newNickname;
  }
  if (!avatar || !ws) return;
  avatar.changeNickname(nickname.current);
  ws.send_nickname(nickname.current);
};

export default nicknameHandler;
