import {IPlayer} from "./IPlayer";
import {ICard, ICardDeck} from "./ICard";

export interface ILobby {
    id: string,
    gameName: string,
    players: IPlayer[],
    currentTurn: number,
    cardDecks: ICardDeck[],
    currentCard: ICard,
    currentHistoryCardDeckIndex: number,
    currentSportsCardDeckIndex: number,
    currentTechCardDeckIndex: number,
    currentCountryCardDeckIndex: number,
    currentCat: string
}