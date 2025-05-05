import { useEffect, useState } from "react";
import { useChessClock } from "../hooks/useChessClock";

export function WakeLockWatcher() {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const state = useChessClock((store) => store.state);

  useEffect(() => {
    if (state === "running" && wakeLock === null) {
      navigator.wakeLock
        .request("screen")
        .then((wakeLock) => {
          wakeLock.addEventListener("release", () => {
            setWakeLock(null);
          });
          setWakeLock(wakeLock);
        })
        .catch((e) => {
          console.log("error creating wake lock:", e);
        });
    } else if (state !== "running" && wakeLock !== null) {
      wakeLock.release();
    }
  }, [state, wakeLock]);

  return null;
}
