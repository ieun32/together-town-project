import React from "react";
import logo from "../assets/images/logo.png";
import {
  setSessionNickname,
  setSessionWeapon,
} from "../functions/sessionStorage";

const WelcomeScreen = ({
  setHasNickname,
}: {
  setHasNickname: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [nickname, setNickname] = React.useState("");
  const [weapon, setWeapon] = React.useState("none");

  return (
    <main>
      <section className="welcome-container">
        <img src={logo} alt="logo" />
        <h2>
          <span className="title">Welcome to </span>
          <span className="title-color">Together town! ✨</span>
        </h2>
        <div className="form">
          <input
            type="text"
            value={nickname}
            placeholder="닉네임을 입력해주세요"
            onChange={(e) => setNickname(e.target.value)}
          />
          <select
            value={weapon}
            onChange={(e) => setWeapon(e.target.value)}
            name="weapon"
            className="weapon"
          >
            <option value="none">무기를 선택해주세요</option>
            <option value="knife">칼 🗡️</option>
            <option value="fire">불기둥 🔥</option>
          </select>
          <button
            onClick={() => {
              if (weapon === "none" || nickname === "") {
                alert("닉네임을 작성하고 무기를 선택해주세요!");
                return;
              }
              setSessionWeapon(weapon);
              setSessionNickname(nickname);
              setHasNickname(true);
            }}
          >
            START!
          </button>
        </div>
      </section>
    </main>
  );
};

export default WelcomeScreen;
