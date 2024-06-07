import mapImageSrc from "../assets/images/map.png";
import playerDownSrc from "../assets/images/playerDown.png";
import playerUpImageSrc from "../assets/images/playerUp.png";
import playerLeftImageSrc from "../assets/images/playerLeft.png";
import playerRightImageSrc from "../assets/images/playerRight.png";

const mapImage = new Image();
const playerDownImage = new Image();
const playerUpImage = new Image();
const playerLeftImage = new Image();
const playerRightImage = new Image();

mapImage.src = mapImageSrc;
playerUpImage.src = playerUpImageSrc;
playerLeftImage.src = playerLeftImageSrc;
playerRightImage.src = playerRightImageSrc;
playerDownImage.src = playerDownSrc;

const images = {
  mapImage,
  playerUpImage,
  playerLeftImage,
  playerRightImage,
  playerDownImage,
};

export default images;
