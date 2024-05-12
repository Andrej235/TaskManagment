import "./ManualCardContainer.scss";
import { useEffect, useRef } from "react";
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
  const draggingCard = useRef<{
    card: Card;
    ref: HTMLDivElement;
  } | null>(null);

  const orderedCards = useRef<Card[]>([]);

  useEffect(() => {
    orderedCards.current = cards;
  }, [cards]);

  const { contextSafe } = useGSAP();
  const swapPlaces = contextSafe(
    (
      card1: Card,
      card1Ref: HTMLDivElement,
      card2: Card,
      card2Ref: HTMLDivElement
    ) => {
      const card1Rect = card1Ref.getBoundingClientRect();
      const card2Rect = card2Ref.getBoundingClientRect();

      const card1Index = orderedCards.current.findIndex(
        (x) => x.id === card1.id
      );
      const card2Index = orderedCards.current.findIndex(
        (x) => x.id === card2.id
      );

      //Card 1 is under card 2 - dragging card 1 up
      if (card1Rect.y > card2Rect.y) {
        //Moves lower card up
        gsap.set(card1Ref, {
          y: `+=${card2Rect.y - card1Rect.y}`,
        });

        let y = card1Rect.height;

        for (
          let i = Math.min(card1Index, card2Index);
          i < Math.max(card1Index, card2Index);
          i++
        ) {
          const currentCardRef = document.querySelector(
            `#card-${orderedCards.current[i].id}`
          )!;
          const currentCardRect = currentCardRef.getBoundingClientRect();

          gsap.set(currentCardRef, {
            y: `+=${y - (currentCardRect.y - card2Rect.y)}`,
          });

          y += currentCardRect.height;
        }
      }
      //Card 1 is above card 2 - dragging card 1 down
      else {
        let y = 0;

        for (
          let i = Math.min(card1Index, card2Index) + 1;
          i <= Math.max(card1Index, card2Index);
          i++
        ) {
          console.log(i);

          const currentCardRef = document.querySelector(
            `#card-${orderedCards.current[i].id}`
          )!;
          const currentCardRect = currentCardRef.getBoundingClientRect();

          gsap.set(currentCardRef, {
            y: `+=${y - (currentCardRect.y - card1Rect.y)}`,
          });

          y += currentCardRect.height;
        }

        gsap.set(card1Ref, {
          y: `+=${y}`,
        });
      }

      orderedCards.current = reorderArray(
        orderedCards.current,
        card1Index,
        card2Index
      );
    }
  );

  function reorderArray<T extends Card>(
    array: T[],
    from: number,
    to: number
  ): T[] {
    const newArray: T[] = [];

    if (from < to) {
      newArray.push(...array.slice(0, from));
      newArray.push(...array.slice(from + 1, to + 1));
      newArray.push(array[from]);
      newArray.push(...array.slice(to + 1));
    } else {
      newArray.push(...array.slice(0, to));
      newArray.push(array[from]);
      newArray.push(...array.slice(to, from));
      newArray.push(...array.slice(from + 1));
    }

    return newArray;
  }

  return (
    <div className="card-container" ref={cardHolderRef}>
      {cards.map((x) => {
        return (
          <CardDisplay
            id={`card-${x.id}`}
            key={`card-${x.id}`}
            onDragStart={(_, ref) => {
              draggingCard.current = {
                card: x,
                ref,
              };
            }}
            onDragEnd={() => {
              draggingCard.current = null;
            }}
            onMouseOver={(e) => {
              if (!draggingCard.current) return;
              const target = e.target as HTMLDivElement;

              if (target === draggingCard.current?.ref) {
                console.log("same");
                return;
              }

              swapPlaces(
                draggingCard.current.card,
                draggingCard.current.ref,
                x,
                target
              );
            }}
          >
            {x.text}
          </CardDisplay>
        );
      })}
    </div>
  );
}
