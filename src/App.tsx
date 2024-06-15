import React, { useEffect } from "react";
import Canvas from "./components/Canvas";
import WelcomeScreen from "./components/WelcomeScreen";
import { hasSessionNickname } from "./functions/sessionStorage";
import "./App.css";

const App = () => {
  const [hasNickname, setHasNickname] = React.useState(false);
  const [isDead, setIsDead] = React.useState(false);

  useEffect(() => {
    if (hasSessionNickname()) {
      setHasNickname(true);
    }
  }, []);

  return (
    <>
      {hasNickname && !isDead ? (
        <Canvas setIsDead={setIsDead} />
      ) : (
        <WelcomeScreen setHasNickname={setHasNickname} />
      )}
    </>
  );
};

export default App;
