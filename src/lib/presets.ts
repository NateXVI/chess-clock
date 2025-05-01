import type { GameConfig, TimeControl } from "./config";

function min(num: number) {
  return num * 60 * 1000;
}

function sec(num: number) {
  return num * 1000;
}

function eqTc(tc: TimeControl) {
  return {
    timeControlA: tc,
    timeControlB: tc,
  };
}

export const separator = " | ";

export const defaultPreset: GameConfig = {
  name: "10 min",
  group: "rapid",
  ...eqTc({ time: min(10), increment: sec(0) }),
};

export const presets: GameConfig[] = [
  // bullet
  {
    name: "1 min",
    group: "bullet",
    ...eqTc({ time: min(1), increment: sec(0) }),
  },
  {
    name: `1${separator}1`,
    group: "bullet",
    ...eqTc({ time: min(1), increment: sec(1) }),
  },
  {
    name: `2${separator}1`,
    group: "bullet",
    ...eqTc({ time: min(2), increment: sec(1) }),
  },
  // blitz
  {
    name: "3 min",
    group: "blitz",
    ...eqTc({ time: min(3), increment: sec(0) }),
  },
  {
    name: `3${separator}2`,
    group: "blitz",
    ...eqTc({ time: min(3), increment: sec(2) }),
  },
  {
    name: "5 min",
    group: "blitz",
    ...eqTc({ time: min(5), increment: sec(0) }),
  },
  // rapid
  {
    name: "10 min",
    group: "rapid",
    ...eqTc({ time: min(10), increment: sec(0) }),
  },
  {
    name: `15${separator}10`,
    group: "rapid",
    ...eqTc({ time: min(15), increment: sec(10) }),
  },
  {
    name: "30 min",
    group: "rapid",
    ...eqTc({ time: min(30), increment: sec(0) }),
  },
];
