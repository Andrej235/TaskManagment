import { useEffect, useState } from "react";

const useHover = ({ x }: { x: HTMLDivElement | null }) => {
  const [hover, setHover] = useState<boolean>(false);
  useEffect(() => {
    const updateHover = (ev: MouseEvent) =>
      setHover(
        x && ev.target instanceof HTMLDivElement ? x.contains(ev.target) : false
      );

    window.addEventListener("mousemove", updateHover);
    return () => window.removeEventListener("mousemove", updateHover);
  }, [x]);
  return hover;
};
export default useHover;
