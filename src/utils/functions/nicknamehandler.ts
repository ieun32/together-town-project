import Sprite from "../classes/Sprite";
import _WebSocket from "../classes/WebSocket";

const nicknameHandler = (
  avatar: Sprite,
  nickname: React.MutableRefObject<string>,
  ws: _WebSocket,
) => {
  const newNickname = prompt("새로운 닉네임을 입력해주세요", nickname.current);
  if (newNickname) {
    nickname.current = newNickname;
  }
  avatar.changeNickname(nickname.current);
  ws.send_nickname(nickname.current);
};

export default nicknameHandler;
