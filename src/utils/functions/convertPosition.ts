/**
 * 기존 좌표를 변환 대상 블록 사이즈에 맞게 변환하는 함수
 * @param x 기존 x좌표
 * @param y 기존 y좌표
 * @param fromBlockSize 기존 블록 사이즈
 * @param toBlockSize 변환 대상 블록 사이즈
 * @returns { x: number, y: number } 변환된 좌표
 */
function convertPosition(
  x: number,
  y: number,
  fromBlockSize: number,
  toBlockSize: number,
): { x: number; y: number } {
  const scaleFactor = toBlockSize / fromBlockSize;
  return { x: x * scaleFactor, y: y * scaleFactor };
}

export default convertPosition;
