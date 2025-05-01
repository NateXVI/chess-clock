import { Pause, Play } from "lucide-react";
import { useChessClock } from "../hooks/useChessClock";
import { useState } from "react";
import { Spinner } from "./Spinner";

export function PauseButton() {
  const state = useChessClock((state) => state.state);
  const pause = useChessClock((state) => state.pause);
  const resume = useChessClock((state) => state.resume);
  const [isOpen, setIsOpen] = useState(false);

  const [longPressTimeout, setLongPressTimeout] = useState<number | null>(null);

  const clearTimeout = () => {
    if (longPressTimeout) {
      window.clearTimeout(longPressTimeout);
      setLongPressTimeout(null);
    }
  };

  const start = () => {
    clearTimeout();
    const timeout = window.setTimeout(() => {
      if (state === "idle") {
        setIsOpen(true);
      }
    }, 1000);
    setLongPressTimeout(timeout);
  };

  return (
    <>
      {state !== "paused" ? (
        <button
          onClick={pause}
          onMouseDown={start}
          onTouchStart={start}
          onMouseUp={clearTimeout}
          onTouchEnd={clearTimeout}
          onMouseLeave={clearTimeout}
          onTouchCancel={clearTimeout}
          className="flex items-center justify-center select-none bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full w-16 h-16"
          aria-label="Pause game"
        >
          <Pause size={24} />
        </button>
      ) : (
        <button
          onClick={resume}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white p-2 rounded-full w-16 h-16"
          aria-label="Start game"
          disabled={state !== "paused"}
        >
          <Play size={24} />
        </button>
      )}
      {isOpen && <Spinner close={() => setIsOpen(false)} />}
    </>
  );
}
