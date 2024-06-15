import { convertAndMakeSprite } from "./convertPosition";
import { usersType } from "../types/utils";
import Sprite from "../classes/Sprite";
import _WebSocket from "../classes/WebSocket";

// const isColliding = (
//   weaponX: number,
//   weaponY: number,
//   targetX: number,
//   targetY: number,
//   targetSize: number,
// ) => {
//   const dx = weaponX - targetX;
//   const dy = weaponY - targetY;
//   const distance = Math.sqrt(dx * dx + dy * dy);
//   return distance < targetSize;
// };

const attackHandler = (
  sprite: Sprite,
  users: usersType[],
  websocket: _WebSocket | null,
) => {
  const damage = 0.5;

  // 반지름 길이
  const radius =
    sprite.weapon === "knife" ? sprite.blocksize * 1.5 : sprite.blocksize * 5.5;

  // 캐릭터의 중심 좌표 계산
  const centerX = sprite.position.x + sprite.blocksize / 2;
  const centerY =
    sprite.position.y + (sprite.image.height * sprite.scaleFactor) / 1.4;

  // 각도
  const angle = sprite.attack.angle;

  users.forEach((user) => {
    if (user.nickname === sprite.nickname) return;
    const convertedTarget = convertAndMakeSprite(sprite, user);

    // 캐릭터의 중심으로부터 각 유저까지의 거리를 계산
    // 거리가 반지름보다 작으면
    // 캐릭터의 중심으로부터 각도를 계산
    // 각도가 angle로부터 +- 30도 이내이면
    // 해당 유저에게 데미지를 입힘
    if (!convertedTarget) return;

    const dx = convertedTarget.position.x - centerX;
    const dy = convertedTarget.position.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // 왜 오른쪽에 있는 캐릭터가 왼쪽으로 공격했을 때는 isColleded가 false로 나오는지 모르겠음
    const isCollided = distance < radius;

    const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);

    const isAngleMatched =
      targetAngle >= angle - 45 && targetAngle <= angle + 45;

    console.log(
      isCollided,
      distance,
      radius,
      isAngleMatched,
      targetAngle,
      angle,
    );
    if (isCollided && isAngleMatched) {
      convertedTarget.health -= damage;
      websocket?.send_attacked_user(convertedTarget);
    }
  });
};

export default attackHandler;
