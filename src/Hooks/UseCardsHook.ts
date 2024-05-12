import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CardsProps } from "../Components/CardContainer";
import Card from "../Components/Card";

const useCard = (
  cards: string[]
): { cards: CardsProps; setCards: Dispatch<SetStateAction<CardsProps>> } => {
  const [items, setItems] = useState<CardsProps>({
    items: [],
    state: null,
    changedIds: null,
  });

  useEffect(() => {
    setItems({
      items: cards.map((x) => Card.create(x)),
      state: null,
      changedIds: null,
    });
  }, [cards]);

  return { cards: items, setCards: setItems };
};
export default useCard;
