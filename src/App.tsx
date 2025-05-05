import "./index.css";
import { Timer } from "./components/Timer";
import { useChessClock } from "./hooks/useChessClock";
import { useEffect } from "react";
import { GameControls } from "./components/GameControls";

export function App() {
  const { playerA, playerB, click, toggle, togglePause, reset } =
    useChessClock();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const modifierIsPressed = (() => {
        if (event.ctrlKey) return true;
        if (event.shiftKey) return true;
        if (event.altKey) return true;
        if (event.metaKey) return true;
        return false;
      })();

      if (modifierIsPressed || event.target instanceof HTMLInputElement) {
        return;
      }
      event.preventDefault();
      if (event.key === " ") {
        toggle();
      }
      if (event.key === "p") {
        togglePause();
      }
      if (event.key === "r") {
        reset();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full h-[100vh] grid portrait:grid-rows-[1fr_auto_1fr] landscape:grid-cols-[1fr_auto_1fr]">
      <Timer
        top
        player={playerA}
        onClick={() => {
          click("A");
        }}
      />
      <GameControls />
      <Timer
        player={playerB}
        onClick={() => {
          click("B");
        }}
      />
    </div>
  );
}

export default App;
