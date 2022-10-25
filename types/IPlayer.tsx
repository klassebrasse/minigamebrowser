import {ICard} from "./ICard";

export interface IPlayer {
    id: string,
    nickname: string,
    score: number,
    cards: ICard[]
}