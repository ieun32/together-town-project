const getSessionNickname = () => {
  return sessionStorage.getItem("nickname");
};

const setSessionNickname = (nickname: string) => {
  sessionStorage.setItem("nickname", nickname);
};

const hasSessionNickname = () => {
  return getSessionNickname() ? true : false;
};

const getSessionWeapon = () => {
  return sessionStorage.getItem("weapon");
};

const setSessionWeapon = (weapon: string) => {
  sessionStorage.setItem("weapon", weapon);
};

const hasSessionWeapon = () => {
  return getSessionWeapon() ? true : false;
};

export {
  getSessionNickname,
  setSessionNickname,
  hasSessionNickname,
  getSessionWeapon,
  setSessionWeapon,
  hasSessionWeapon,
};
