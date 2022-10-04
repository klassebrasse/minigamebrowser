import {IGame} from "../types/IGame";
import {Card} from "@mui/material";
function GameCard(game: IGame) {
    return(
        <Card>
            <h1 style={{color: "red"}}>{game.name} 	&rarr;</h1>
        </Card>
    )
}

export default GameCard;