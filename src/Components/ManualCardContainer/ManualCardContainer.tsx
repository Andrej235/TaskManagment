import "./ManualCardContainer.scss";
import { useRef } from "react";
import Card from "../Card";
import CardDisplay from "../CardDisplay/CardDisplay";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface ManualCardContainerProps {
  cards: Card[];
}

export default function ManualCardContainer({
  cards,
}: ManualCardContainerProps) {
  const cardHolderRef = useRef<HTMLDivElement>(null);
  const draggingCard = useRef<HTMLDivElement | null>(null);

  const { contextSafe } = useGSAP();
  const swapPlaces = contextSafe(
    (card1: HTMLDivElement, card2: HTMLDivElement) => {
      const card1Rect = card1.getBoundingClientRect();
      const card2Rect = card2.getBoundingClientRect();

      if (card1Rect.y > card2Rect.y) {
        //Moves lower card up
        gsap.set(card1, {
          y: `+=${-card2Rect.height}`,
        });

        //Moves higher card up
        gsap.set(card2, {
          y: `+=${card1Rect.height}`,
        });
      } else if (card1Rect.y < card2Rect.y) {
        //Moves lower card up
        gsap.set(card2, {
          y: `+=${-card1Rect.height}`,
        });

        //Moves higher card up
        gsap.set(card1, {
          y: `+=${card2Rect.height}`,
        });
      }
    }
  );

  return (
    <div className="card-container" ref={cardHolderRef}>
      {cards.map((x) => (
        <CardDisplay
          id={`card-${x.id}`}
          key={`card-${x.id}`}
          onDragStart={(_, ref) => {
            draggingCard.current = ref;
          }}
          onDragEnd={() => {
            draggingCard.current = null;
          }}
          onMouseOver={(e) => {
            if (e.target === draggingCard.current) {
              console.log("same");
              return;
            }

            if (!draggingCard.current) return;

            swapPlaces(draggingCard.current, e.target as HTMLDivElement);
          }}
        >
          {x.text}
        </CardDisplay>
      ))}
    </div>
  );
}
