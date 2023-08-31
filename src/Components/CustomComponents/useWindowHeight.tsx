import { useState, useEffect } from 'react';

export function useWindowHeightHeader(initialHeight = window.innerHeight - 80) {
  const [height, setHeight] = useState(initialHeight);

  useEffect(() => {
    function handleResize() {
      const newHeight = window.innerHeight - 80;
      setHeight(newHeight);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return height;
}

export function useWindowHeight(initialHeight = window.innerHeight) {
  const [height, setHeight] = useState(initialHeight);

  useEffect(() => {
    function handleResize() {
      const newHeight = window.innerHeight;
      setHeight(newHeight);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return height;
}