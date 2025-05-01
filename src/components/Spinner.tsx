import { useState } from "react";

type SpinnerProps = {
  close: () => void;
};

export function Spinner({ close }: SpinnerProps) {
  let [shouldRotate] = useState(Math.random() > 0.5);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-black/20 backdrop-blur-md text-white`}
      onClick={close}
    >
      <div
        style={{
          touchAction: "auto",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        className="flex-1 overflow-y-auto px-6 pt-4 pb-24 flex items-center justify-center"
      >
        <div className={`w-fit ${shouldRotate ? "rotate-180" : ""}`}>
          <div className="slow-stop w-fit overflow-clip h-[80vmin]">
            <img
              className="landscape:rotate-90 aspect-square w-[80vmin] h-[80vmin]"
              src="/spinner.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
