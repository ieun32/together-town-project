import React, { useEffect } from "react";
import Canvas from "./components/Canvas";
import WelcomeScreen from "./components/WelcomeScreen";
import { hasSessionNickname } from "./functions/sessionStorage";
import "./App.css";

const App = () => {
  const [hasNickname, setHasNickname] = React.useState(false);

  useEffect(() => {
    if (hasSessionNickname()) {
      setHasNickname(true);
    }
  }, []);

  return (
    <>
      {hasNickname ? (
        <Canvas />
      ) : (
        <WelcomeScreen setHasNickname={setHasNickname} />
      )}
    </>
  );
};

export default App;
