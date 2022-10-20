import {IPlayer} from "./IPlayer";

export interface ILobby {
    id: string,
    gameName: string,
    players: IPlayer[]
}