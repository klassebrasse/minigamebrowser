export interface ICard {
    event: string,
    year: string,
    color: string,
    isSafe: boolean
}

export interface ICardDeck {
    category: string,
    cards: ICard[]
}