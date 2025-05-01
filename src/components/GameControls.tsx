import { useChessClock } from "../hooks/useChessClock";
import { ResetButton } from "./ResetButton";
import { Options } from "./Options";
import { PauseButton } from "./PauseButton";

export function GameControls() {
  const state = useChessClock((state) => state.state);
  const config = useChessClock((state) => state.config);

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
        <PauseButton />
        <ResetButton />
      </div>
      <div></div>
    </div>
  );
}
