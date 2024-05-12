export default class Card {
  id: number = -1;
  text: string = "";

  private constructor(id: number, text: string) {
    this.id = id;
    this.text = text;
  }

  private static highestId: number = 0;
  static create(text: string): Card {
    return new Card(Card.highestId++, text);
  }
}
