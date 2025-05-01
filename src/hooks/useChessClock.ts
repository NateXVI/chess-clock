import { GameConfig } from "../lib/config";
import { CountDownTimer } from "../lib/timer";
import { create } from "zustand";
import { defaultPreset } from "../lib/presets";

export type Player = {
  name: string;
  isActive: boolean;
  timer: CountDownTimer;
};

export type Turn = "A" | "B";

type GameState = "idle" | "running" | "paused" | "ended";

type ChessClockStore = {
  state: GameState;
  turn: Turn;
  playerA: Player;
  playerB: Player;
  config: GameConfig;
  reset: () => void;
  click: (button: Turn) => void;
  toggle: () => void;
  togglePause: () => void;
  pause: () => void;
  resume: () => void;
  end: () => void;
  setConfig: (config: GameConfig) => void;
};

export const useChessClock = create<ChessClockStore>((set, get) => {
  return {
    state: "idle",
    turn: "A",
    playerA: {
      name: "Player 1",
      isActive: false,
      timer: new CountDownTimer({
        isRunning: false,
        startTime:
          defaultPreset.timeControlA.time +
          defaultPreset.timeControlA.increment,
      }),
    },
    playerB: {
      name: "Player 2",
      isActive: false,
      timer: new CountDownTimer({
        isRunning: false,
        startTime:
          defaultPreset.timeControlB.time +
          defaultPreset.timeControlB.increment,
      }),
    },
    reset() {
      set(({ playerA, playerB, config }) => {
        playerA.timer.setRunning(false);
        playerB.timer.setRunning(false);
        playerA.timer.setTime(
          config.timeControlA.time + config.timeControlA.increment
        );
        playerB.timer.setTime(
          config.timeControlB.time + config.timeControlB.increment
        );
        return { playerA, playerB, state: "idle", turn: "A" };
      });
    },
    config: defaultPreset,
    click: (button: Turn) => {
      const { playerA, playerB, state, turn, config } = get();

      if (state === "idle") {
        const turn = button === "A" ? "B" : "A";
        if (turn === "A") {
          playerA.timer.setRunning(true);
          playerB.timer.setRunning(false);
        }
        if (turn === "B") {
          playerA.timer.setRunning(false);
          playerB.timer.setRunning(true);
        }
        set({ state: "running", turn });
      } else if (state === "running") {
        if (button === turn) {
          let nextTurn: Turn = button === "A" ? "B" : "A";
          if (turn === "A") {
            playerA.timer.setRunning(false);
            playerB.timer.setRunning(true);

            playerA.timer.addTime(config.timeControlA.increment);
          }
          if (turn === "B") {
            playerA.timer.setRunning(true);
            playerB.timer.setRunning(false);

            playerB.timer.addTime(config.timeControlB.increment);
          }
          set({ turn: nextTurn });
        }
      }
    },
    toggle: () => {
      const { state, turn, click, resume } = get();
      if (state === "running") {
        click(turn);
      }
      if (state === "paused") {
        resume();
      }
    },
    togglePause: () => {
      const { state, pause, resume } = get();
      if (state === "running") {
        pause();
      } else if (state === "paused") {
        resume();
      }
    },
    pause: () => {
      const { playerA, playerB, state } = get();
      if (state !== "running") return;
      playerA.timer.setRunning(false);
      playerB.timer.setRunning(false);
      set({ state: "paused" });
    },
    resume: () => {
      const { playerA, playerB, state, turn } = get();
      if (state !== "paused") return;
      if (turn === "A") {
        playerA.timer.setRunning(true);
        playerB.timer.setRunning(false);
      } else {
        playerA.timer.setRunning(false);
        playerB.timer.setRunning(true);
      }
      set({ state: "running" });
    },
    end: () => {
      const { playerA, playerB } = get();
      playerA.timer.setRunning(false);
      playerB.timer.setRunning(false);
      set({ state: "ended" });
    },
    setConfig: (config: GameConfig) => {
      set({ config });
    },
  };
});

useChessClock.setState((state) => {
  state.playerA.timer.onChange((timer) => {
    useChessClock.setState((state) => {
      state.playerA.isActive = timer.isRunning();
      return state;
    });
  });

  state.playerB.timer.onChange((timer) => {
    useChessClock.setState((state) => {
      state.playerB.isActive = timer.isRunning();
      return state;
    });
  });

  state.playerA.timer.onEnd(() => {
    state.end();
  });

  state.playerB.timer.onEnd(() => {
    state.end();
  });

  return state;
});
