import { Logger } from "@babylonjs/core";
import { useEffect, useRef } from "react";
import LemonEngine from "../core/LemonEngine";
import LemonScene from "../core/LemonScene";

export default function LemonCanvas() {
  const mainCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    Logger.LogLevels = Logger.ErrorLogLevel;

    const { current: canvas } = mainCanvas;
    if (!canvas) {
      return;
    }

    let engine: LemonEngine;
    let scene: LemonScene;

    const initialize = async () => {
      engine = new LemonEngine(canvas);
      await engine.initAsync();
      scene = new LemonScene(engine, canvas);
      engine.runRenderLoop(() => {
        scene.render();
      });

      const resizeCallback = () => {
        engine.resize();
      };

      if (window) {
        window.addEventListener("resize", resizeCallback);
      }

      engine.resize();

      return () => {
        scene.dispose();
        engine.dispose();

        if (window) {
          window.removeEventListener("resize", resizeCallback);
        }
      };
    };
    const cleanupPromise = initialize();

    return () => {
      cleanupPromise
        .then((cleanup) => {
          if (cleanup) {
            cleanup();
          }
        })
        .catch((_err) => {
          if (engine) {
            engine.dispose();
          }
        });
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        flexGrow: "1",
        width: "100%",
        height: "100%",
      }}
    >
      <canvas
        ref={mainCanvas}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          outline: "none",
        }}
        tabIndex={0}
      ></canvas>
    </div>
  );
}
