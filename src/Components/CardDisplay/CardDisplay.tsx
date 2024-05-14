import { MouseEventHandler, useEffect, useRef } from "react";
import "./CardDisplay.scss";
import gsap from "gsap";
import Observer from "gsap/Observer";
gsap.registerPlugin(Observer);

type CardDisplayProps = {
  children: string;
  id: string;
  onDragStart?: (rect: DOMRect, ref: HTMLDivElement) => void;
  onDragEnd?: (rect: DOMRect, ref: HTMLDivElement) => void;
  onDrag?: (xDelta: number, yDelta: number) => void;
  onMouseOver?: MouseEventHandler<HTMLDivElement>;
};

export default function CardDisplay({
  children,
  id,
  onDrag,
  onDragEnd,
  onDragStart,
  onMouseOver,
}: CardDisplayProps) {
  const cardDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardDisplayRef.current) return;

    const observer = Observer.create({
      target: cardDisplayRef.current,
      type: "touch,pointer",
      onDragStart: () => {
        console.log('start');
        onDragStart?.(
          cardDisplayRef.current!.getBoundingClientRect(),
          cardDisplayRef.current!
        );
      },
      onDragEnd: () => {
        console.log('end');
        onDragEnd?.(
          cardDisplayRef.current!.getBoundingClientRect(),
          cardDisplayRef.current!
        );
      },
      onDrag: (x) => {
        console.log("onDrag");
        onDrag?.(x.deltaX, x.deltaY);
      },
      preventDefault: true,
    });

    return () => observer.kill();
  }, [cardDisplayRef.current]);

  return (
    <div
      className="card"
      ref={cardDisplayRef}
      onMouseOver={onMouseOver}
      id={id}
    >
      {children}
    </div>
  );
}
