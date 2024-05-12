import { useMemo } from "react";
import useCard from "./Hooks/UseCardsHook";
import ManualCardContainer from "./Components/ManualCardContainer/ManualCardContainer";

function App() {
  const cardsText = useMemo(
    () => [
      "GSAP itself is completely framework-agnostic and can be used in any JS framework without any special",
      "wrappers or dependencies. However, this hook solves a few React-specific friction points for you so that",
      "you can just focus on the fun stuff. 🤘🏻",
      "Import the useGSAP() hook from @gsap/react and you're good to go!",
      "Proper animation cleanup is very important with frameworks, but especially with React.",
    ],
    []
  );
  const { cards } = useCard(cardsText);

  // return <CardContainer cards={cards} onReorder={setCards} />;
  return <ManualCardContainer cards={cards.items} />;
}

export default App;
