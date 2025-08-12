import { Logger } from "@babylonjs/core";
import { useEffect, useRef } from "react";
import LemonEngine from "../core/LemonEngine";
import LemonScene from "../core/LemonScene";
import useLemonStageStore from "../store/LemonStageStore";

export default function LemonCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCanvas = useRef<HTMLCanvasElement>(null);
  const { setEngine, setScene } = useLemonStageStore();

  useEffect(() => {
    Logger.LogLevels = Logger.ErrorLogLevel;

    const { current: canvas } = mainCanvas;
    if (!canvas) {
      return;
    }

    let engine: LemonEngine;
    let scene: LemonScene;
    let resizeObserver: ResizeObserver | undefined;

    const initialize = async () => {
      engine = new LemonEngine(canvas);
      await engine.initAsync();
      scene = new LemonScene(engine, canvas);

      setEngine(engine);
      setScene(scene);

      engine.runRenderLoop(() => {
        scene.render();
      });

      if (containerRef.current) {
        let resizeTimer: number | null = null;
        // CSS animation
        resizeObserver = new ResizeObserver(() => {
          if (resizeTimer) clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            engine.resize();
          }, 16);
        });
        resizeObserver.observe(containerRef.current);
      }

      engine.resize();

      return () => {
        scene.dispose();
        engine.dispose();
        if (resizeObserver && containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
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
      ref={containerRef}
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
