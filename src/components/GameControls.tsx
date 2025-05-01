import { useChessClock } from "../hooks/useChessClock";
import { Pause, Play } from "lucide-react";
import { ResetButton } from "./ResetButton";
import { Options } from "./Options";

export function GameControls() {
  const state = useChessClock((state) => state.state);
  const config = useChessClock((state) => state.config);
  const pause = useChessClock((state) => state.pause);
  const resume = useChessClock((state) => state.resume);

  return (
    <div className="bg-gray-800 flex justify-between items-center gap-3 my-4 px-4 flex-col landscape:w-40">
      <div className="text-white text-center flex flex-col gap-x-1 opacity-70">
        <div>
          <div>
            {config.name} ({config.group})
          </div>
        </div>
        <div className="text-white text-center opacity-50 text-sm">
          {state === "idle" && <div>Ready to start</div>}
          {state === "running" && <div>Game in progress</div>}
          {state === "paused" && <div>Game paused</div>}
          {state === "ended" && <div>Game ended</div>}
        </div>
      </div>
      <div className="flex justify-center items-center gap-6 flex-col portrait:flex-row">
        <Options />
        {state !== "paused" ? (
          <button
            onClick={pause}
            className="flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full w-16 h-16"
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
        <ResetButton />
      </div>
      <div></div>
    </div>
  );
}
