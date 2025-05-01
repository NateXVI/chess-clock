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
    name: `20 sec${separator}1`,
    group: "bullet",
    ...eqTc({ time: sec(20), increment: sec(1) }),
  },
  {
    name: `30 sec`,
    group: "bullet",
    ...eqTc({ time: sec(30), increment: sec(0) }),
  },
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
  {
    name: `5${separator}2`,
    group: "blitz",
    ...eqTc({ time: min(5), increment: sec(2) }),
  },
  {
    name: `5${separator}5`,
    group: "blitz",
    ...eqTc({ time: min(5), increment: sec(5) }),
  },
  // rapid
  {
    name: "10 min",
    group: "rapid",
    ...eqTc({ time: min(10), increment: sec(0) }),
  },
  {
    name: `10${separator}5`,
    group: "rapid",
    ...eqTc({ time: min(10), increment: sec(5) }),
  },
  {
    name: `15${separator}10`,
    group: "rapid",
    ...eqTc({ time: min(15), increment: sec(10) }),
  },
  {
    name: "20 min",
    group: "rapid",
    ...eqTc({ time: min(20), increment: sec(0) }),
  },
  {
    name: "30 min",
    group: "rapid",
    ...eqTc({ time: min(30), increment: sec(0) }),
  },
  {
    name: "60 min",
    group: "rapid",
    ...eqTc({ time: min(60), increment: sec(0) }),
  },
  // classical
  {
    name: "90 min",
    group: "classical",
    ...eqTc({ time: min(90), increment: sec(0) }),
  },
  {
    name: `90${separator}30`,
    group: "classical",
    ...eqTc({ time: min(90), increment: sec(30) }),
  },
  {
    name: `120${separator}30`,
    group: "classical",
    ...eqTc({ time: min(90), increment: sec(30) }),
  },
];

export const groupedPresets: [string, GameConfig[]][] = presets.reduce(
  (acc, preset) => {
    const group = acc.find(([g]) => g === preset.group);
    if (group) {
      group[1].push(preset);
    } else {
      acc.push([preset.group, [preset]]);
    }
    return acc;
  },
  [] as [string, GameConfig[]][]
);

console.log(groupedPresets);
