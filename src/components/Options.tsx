import { Settings } from "lucide-react";
import { useState } from "react";
import { presets, separator } from "../lib/presets";
import { useChessClock } from "../hooks/useChessClock";

export function Options() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("bullet");
  const setConfig = useChessClock((state) => state.setConfig);
  const reset = useChessClock((state) => state.reset);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full w-12 h-12"
      >
        <Settings size={24} />
      </button>

      <div
        className={`fixed inset-0 z-50 flex flex-col bg-gray-800 text-white ${
          isOpen ? "" : "hidden"
        }`}
      >
        {/* Scrollable Content */}
        <div
          style={{
            touchAction: "auto",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
          className="flex-1 overflow-y-auto px-6 pt-4 pb-24"
        >
          <div className="max-w-2xl mx-auto py-4">
            {/* CONTENT GOES HERE */}
            <Tabs
              tabs={["bullet", "blitz", "rapid", "custom"]}
              setTab={setTab}
              selectedTab={tab}
            />
            <div
              className={`grid grid-cols-1 gap-2 pt-4 ${
                ["custom"].includes(tab) ? "hidden" : ""
              }`}
            >
              {presets
                .filter((p) => p.group === tab)
                .map((preset) => (
                  <button
                    className="text-xl bg-gray-600 py-4 rounded-xl"
                    key={preset.name}
                    onClick={() => {
                      setConfig(preset);
                      reset();
                      setIsOpen(false);
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
            </div>
            <div className={`pt-4 ${tab !== "custom" ? "hidden" : ""}`}>
              <CustomOptions close={() => setIsOpen(false)} />
            </div>
            <div className="h-20"></div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute h-20 bottom-4 left-4 right-4 bg-gray-900 max-w-2xl py-4 text-lg font-semibold text-center mx-auto rounded-4xl"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

type TabsProps = {
  tabs: string[];
  setTab: (tab: string) => void;
  selectedTab: string;
};
function Tabs({ tabs, setTab, selectedTab }: TabsProps) {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setTab(tab)}
          className={`px-4 py-2 rounded-lg capitalize ${
            selectedTab === tab ? "bg-gray-700" : "bg-gray-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

type CustomOptionsProps = {
  close: () => void;
};

function CustomOptions({ close }: CustomOptionsProps) {
  const [sameTime, setSameTime] = useState(true);
  const setConfig = useChessClock((state) => state.setConfig);
  const reset = useChessClock((state) => state.reset);

  const formatName = (timeMin: number, timeSec: number, inc: number) => {
    let name = "";

    if (inc === 0) {
      name += timeMin.toString() + " min";
      if (timeSec > 0) {
        name += " " + timeSec.toString() + " sec";
      }
      return name;
    }

    name += timeMin.toString();
    if (timeSec > 0) {
      name += `:${timeSec.toString().padStart(2, "0")}`;
    }

    name += `${separator}${inc.toString()}`;

    return name;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const timeMinA = parseInt(formData.get("timeMinA") as string) || 0;
    const timeSecA = parseInt(formData.get("timeSecA") as string) || 0;
    const incrementA = parseInt(formData.get("incrementA") as string) || 0;
    const aTime = (timeMinA * 60 + timeSecA) * 1000;
    const aIncrement = incrementA * 1000;

    if (aTime <= 0) {
      return;
    }

    if (sameTime) {
      setConfig({
        name: formatName(timeMinA, timeSecA, incrementA),
        group: "custom",
        timeControlA: { time: aTime, increment: aIncrement },
        timeControlB: { time: aTime, increment: aIncrement },
      });
      reset();
      close();
      return;
    }

    const timeMinB = parseInt(formData.get("timeMinB") as string) || 0;
    const timeSecB = parseInt(formData.get("timeSecB") as string) || 0;
    const incrementB = parseInt(formData.get("incrementB") as string) || 0;
    const bTime = (timeMinB * 60 + timeSecB) * 1000;
    const bIncrement = incrementB * 1000;

    if (bTime <= 0) {
      return;
    }

    setConfig({
      name:
        formatName(timeMinA, timeSecA, incrementA) +
        " / " +
        formatName(timeMinB, timeSecB, incrementB),
      group: "custom",
      timeControlA: { time: aTime, increment: aIncrement },
      timeControlB: { time: bTime, increment: bIncrement },
    });
    reset();
    close();
  };

  return (
    <form
      className="flex flex-col gap-4 bg-gray-700 p-4 rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-2">
        <input
          type="checkbox"
          checked={sameTime}
          onChange={(e) => setSameTime(e.target.checked)}
        />
        <label htmlFor="sameTime">Same time for both players</label>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-large font-semibold">Player 1</h2>
        <TimeInputs nameSuffix="A" />
      </div>
      <div className={`flex flex-col gap-2 ${sameTime ? "hidden" : ""}`}>
        <h2 className="text-large font-semibold">Player 2</h2>
        <TimeInputs nameSuffix="B" />
      </div>
      <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg">
        Apply Custom Settings
      </button>
    </form>
  );
}

type TimeInputsProps = {
  nameSuffix: string;
};

function TimeInputs({ nameSuffix }: TimeInputsProps) {
  const containerClassName = "flex flex-col gap-px";
  const labelClassName = "text-sm";
  const inputClassName = "bg-gray-600 text-white rounded-lg p-2 w-24";
  return (
    <div className="flex gap-2">
      <div className={containerClassName}>
        <label htmlFor={`timeMin${nameSuffix}`} className={labelClassName}>
          Minutes
        </label>
        <input
          type="number"
          inputMode="numeric"
          name={`timeMin${nameSuffix}`}
          placeholder="0"
          defaultValue={5}
          min={0}
          step={1}
          className={inputClassName}
        />
      </div>
      <div className={containerClassName}>
        <label htmlFor={`timeSec${nameSuffix}`} className={labelClassName}>
          Seconds
        </label>
        <input
          type="number"
          inputMode="numeric"
          name={`timeSec${nameSuffix}`}
          placeholder="0"
          min={0}
          max={59}
          step={1}
          className={inputClassName}
        />
      </div>
      <div className={containerClassName}>
        <label htmlFor={`increment${nameSuffix}`} className={labelClassName}>
          Increment
        </label>
        <input
          type="number"
          inputMode="numeric"
          name={`increment${nameSuffix}`}
          placeholder="0"
          className={inputClassName}
          min={0}
          step={1}
        />
      </div>
    </div>
  );
}
