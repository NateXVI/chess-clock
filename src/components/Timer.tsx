import { useEffect, useState } from "react";
import { useRerender } from "../hooks/rerender";
import { useChessClock, type Player } from "../hooks/useChessClock";

export type TimerProps = {
  player: Player;
  onClick?: (player: Player) => void;
  disabled?: boolean;
  top?: boolean;
};

export function Timer({ player, onClick, top = false }: TimerProps) {
  const rerender = useRerender();
  const [rerenderTimeout, setRerenderTimeout] = useState<number | null>(null);
  const state = useChessClock((state) => state.state);
  const enabled = state === "idle" || (state === "running" && player.isActive);
  const hasTime = player.timer.getTime() > 0;
  const buttonState: "active" | "inactive" | "idle" = (() => {
    if (["idle", "paused"].includes(state)) {
      return "idle";
    }
    if (player.isActive) {
      return "active";
    }
    return "inactive";
  })();

  const clearRerenderTimeout = () => {
    if (rerenderTimeout !== null) {
      window.clearTimeout(rerenderTimeout);
      setRerenderTimeout(null);
    }
  };

  const startRerender = () => {
    clearRerenderTimeout();
    setRerenderTimeout(
      window.setTimeout(() => {
        rerender();
        if (player.timer.isRunning() && player.timer.getTime() > 0) {
          startRerender();
        }
      }, (player.timer.getTime() % 1000) + 1)
    );
  };

  useEffect(() => {
    if (player.isActive) {
      startRerender();
    } else {
      clearRerenderTimeout();
    }
    return () => {
      clearRerenderTimeout();
    };
  }, [player.isActive]);

  return (
    <button
      className={`p-5  overflow-clip  transition-all ease-out  ${
        buttonState === "active"
          ? "bg-blue-600 text-white"
          : "bg-gray-800 text-gray-300"
      } ${
        state === "ended" && !hasTime
          ? "bg-red-500 text-white"
          : "disabled:bg-gray-700"
      }`}
      disabled={!enabled}
      onClick={() => onClick?.(player)}
    >
      <div className={`${top ? "portrait:rotate-180" : ""}`}>
        <div
          className={`clock-text transition-all ease-out ${
            enabled || !hasTime
              ? "font-bold scale-125"
              : "font-semibold opacity-50"
          }`}
        >
          {player.timer.getClockTimeString()}
        </div>
      </div>
    </button>
  );
}
