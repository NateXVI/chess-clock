import { RotateCcw } from "lucide-react";
import { useChessClock } from "../hooks/useChessClock";
import { useState } from "react";

export function ResetButton() {
  const reset = useChessClock((state) => state.reset);
  const [confirming, setConfirming] = useState(false);
  const [unconfirmTimeout, setUnconfirmTimeout] = useState<number | null>(null);

  const handleClick = () => {
    if (confirming) {
      reset();
      setConfirming(false);
      if (unconfirmTimeout) {
        clearTimeout(unconfirmTimeout);
        setUnconfirmTimeout(null);
      }
    } else {
      setConfirming(true);
      const timeout = window.setTimeout(() => {
        setConfirming(false);
        setUnconfirmTimeout(null);
      }, 3000);
      setUnconfirmTimeout(timeout);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`transition-colors flex items-center justify-center text-white p-2 rounded-full w-12 h-12 ${
        confirming ? "bg-red-500" : "bg-blue-600 hover:bg-blue-700"
      }`}
      aria-label="Reset game"
    >
      <RotateCcw size={24} />
    </button>
  );
}
