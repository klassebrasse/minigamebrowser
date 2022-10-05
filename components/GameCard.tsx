import {IGame} from "../types/IGame";
import {Button, Card, Grid} from "@mui/material";
function GameCard(game: IGame) {
    return(
            <Grid item style={{backgroundColor: "blue"}}>{game.name} 	&rarr;</Grid>
    )
}

export default GameCard;