import React from "react";

const useCanvas = (setCanvas: (canvas: HTMLCanvasElement) => void) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setCanvas(canvas);
  }, []);

  return canvasRef;
};

export default useCanvas;
