import React, { useState, useCallback } from "react";

export default function useElementHeight() {
  const [height, setHeight] = useState(0);

  const ref = useCallback((node) => {
    if (node) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return [height, ref];
}
