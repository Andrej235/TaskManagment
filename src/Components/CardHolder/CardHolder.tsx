import { useCallback, useRef, useState } from "react";
import "./CardHolder.scss";
import CardDisplay from "../CardDisplay/CardDisplay";
import Card from "../Card";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useHover from "../../Hooks/UseHoverHook";

type CardHolderProps = {
  cards: Card[];
  onReorder: (from: number, to: number) => void;
};

export default function CardHolder({ cards, onReorder }: CardHolderProps) {
  const [draggingCardId, setDraggingCardId] = useState<number>(-1);
  const [movableCardContent, setMovableCardContent] = useState<string>("");

  const movableCardRef = useRef<HTMLDivElement>(null);
  const cardHolderRef = useRef<HTMLDivElement>(null);

  const [isDraggingAvailable, setIsDraggingAvailable] = useState<boolean>(true);

  const { contextSafe } = useGSAP();

  const isHoveringOver = useHover({ x: cardHolderRef.current });

  const setTranslation = useCallback(
    (x: { x: number; y: number }) =>
      contextSafe(({ x, y }: { x: number; y: number }) => {
        if (!movableCardRef.current) return;

        gsap.set(movableCardRef.current, {
          x: `+=${x}`,
          y: `+=${y}`,
        });
      })(x),
    [contextSafe]
  );

  const endDragging = useCallback(
    contextSafe((x: number, y: number, card: HTMLDivElement) => {
      if (!movableCardRef.current) return;

      setDraggingCardId(-1);
      gsap.to(movableCardRef.current, {
        x: 0,
        y: 0,
        left: x,
        top: y,
        duration: 0.25,
        onComplete: () => {
          movableCardRef.current!.style.opacity = "0";
          setIsDraggingAvailable(true);
          card.classList.remove("dragging");
        },
      });
    }),
    [contextSafe, draggingCardId, isHoveringOver]
  );

  const beginDragging = useCallback(
    contextSafe((x: number, y: number, card: HTMLDivElement) => {
      if (!movableCardRef.current) return;

      setIsDraggingAvailable(false);
      card.classList.add("dragging");

      gsap.set(movableCardRef.current, {
        left: x,
        top: y,
        opacity: 1,
      });
    }),
    [contextSafe]
  );

  return (
    <>
      <div className="card-holder" ref={cardHolderRef}>
        {cards.map((x, i) => (
          <CardDisplay
            id={`card-${x.id}`}
            key={`card-${x.id}`}
            onDragStart={(rect, cardDisplay) => {
              if (!isDraggingAvailable) return;

              setDraggingCardId(i);
              console.log(i);
              setMovableCardContent(x.text);

              beginDragging(rect.left, rect.top, cardDisplay);
            }}
            onDragEnd={(rect, cardDisplay) => {
              endDragging(rect.left, rect.top, cardDisplay);
            }}
            onDrag={(xDelta, yDelta) => {
              setTranslation({ x: xDelta, y: yDelta });
            }}
            onMouseOver={() => {
              if (draggingCardId === -1 || draggingCardId === i) return;

              onReorder(draggingCardId, i);
              setDraggingCardId(i);
              // console.log(i);
            }}
          >
            {x.text}
          </CardDisplay>
        ))}
      </div>

      <div className="card" ref={movableCardRef} id="movable-card">
        {movableCardContent}
      </div>
    </>
  );
}
