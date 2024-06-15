class Sprite {
  nickname;
  position;
  image;
  scaleFactor;
  frame;
  moving;
  sprites;
  cursor;
  blocksize;
  weapon;
  attack;  
  health;
  constructor({
    position,
    scaleFactor,
    nickname,
    cursor,
    blocksize,
    weapon,
  }) {
    this.position = {
      x: position.x,
      y: position.y,
      absoluteX: position.absoluteX,
      absoluteY: position.absoluteY,
    };
    this.scaleFactor = scaleFactor;
    this.frame = { val: 0, elapsed: 0 };
    this.moving = false;
    this.attack = {
      state: false,
      endX: 0,
      endY: 0,
      angle: 0,
    };
    this.nickname = nickname;
    this.cursor = cursor || { x: position.x, y: position.y };
    this.blocksize = blocksize;
    this.weapon = weapon;
    this.health = 100;
  }
}

const convertPosition = (
  x,
  y,
  absoluteX,
  absoluteY,
  fromBlockSize,
  toBlockSize,
) => {
  const scaleFactor = toBlockSize / fromBlockSize;
  return {
    x: x * scaleFactor,
    y: y * scaleFactor,
    absoluteX: absoluteX * scaleFactor,
    absoluteY: absoluteY * scaleFactor,
  };
};

// 절대 좌표를 상대 좌표로 변환하는 함수
const convertAbsolutePosition = (me, other) => {
  const dx = other.position.absoluteX - me.position.absoluteX;
  const dy = other.position.absoluteY - me.position.absoluteY;
  const x = other.position.x + dx;
  const y = other.position.y + dy;

  return new Sprite({
    position: {
      x,
      y,
      absoluteX: other.position.absoluteX,
      absoluteY: other.position.absoluteY,
    },
    scaleFactor: other.scaleFactor,
    nickname: other.nickname,
    blocksize: other.blocksize,
    weapon: other.weapon,
  });
}


describe("convertPosition", () => {
  it("블럭 사이즈가 50인애를 블럭사이즈 100인 애로 변경하면 모든 좌표가 두 배가 되어야 함", () => {
    const x = 10;
    const y = 20;
    const absoluteX = 100;
    const absoluteY = 200;
    const fromBlockSize = 50;
    const toBlockSize = 100;

    const result = convertPosition(
      x,
      y,
      absoluteX,
      absoluteY,
      fromBlockSize,
      toBlockSize,
    );

    expect(result).toStrictEqual({
      x: 20,
      y: 40,
      absoluteX: 200,
      absoluteY: 400,
    });
  });

  it("좌표가 모두 0이면 결과도 모두 0이어야 함", () => {
    const x = 0;
    const y = 0;
    const absoluteX = 0;
    const absoluteY = 0;
    const fromBlockSize = 50;
    const toBlockSize = 100;

    const result = convertPosition(
      x,
      y,
      absoluteX,
      absoluteY,
      fromBlockSize,
      toBlockSize,
    );

    expect(result).toEqual({
      x: 0,
      y: 0,
      absoluteX: 0,
      absoluteY: 0,
    });
  });
});

describe("convertAbsolutePosition", () => {

  it("", () => {
    const me = new Sprite({
      position: { x: 10, y: 20, absoluteX: 100, absoluteY: 200 },
      scaleFactor: 1,
      nickname: "me",
      cursor: { x: 10, y: 20 },
      blocksize: 50,
      weapon: null,
    });

    const other = new Sprite({
      position: { x: 30, y: 40, absoluteX: 150, absoluteY: 250 },
      scaleFactor: 1,
      nickname: "other",
      cursor: { x: 30, y: 40 },
      blocksize: 50,
      weapon: null,
    });

    const result = convertAbsolutePosition(me, other);

    expect(result.position).toEqual({
      x: 80, // 30 + (150 - 100)
      y: 90, // 40 + (250 - 200)
      absoluteX: 150,
      absoluteY: 250,
    });
  });
});
