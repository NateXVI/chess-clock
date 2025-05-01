import { useState } from "react";

export function useRerender() {
  const [, set] = useState(0);
  function rerender() {
    set((x) => x + 1);
  }
  return rerender;
}
