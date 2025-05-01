export type TimeControl = {
  time: number;
  increment: number;
};

export type GameConfig = {
  name: string;
  group: string;
  timeControlA: TimeControl;
  timeControlB: TimeControl;
};
