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
        onDragStart?.(
          cardDisplayRef.current!.getBoundingClientRect(),
          cardDisplayRef.current!
        );
      },
      onDragEnd: () => {
        onDragEnd?.(
          cardDisplayRef.current!.getBoundingClientRect(),
          cardDisplayRef.current!
        );
      },
      onDrag: (x) => {
        onDrag?.(x.deltaX, x.deltaY);
      },
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
