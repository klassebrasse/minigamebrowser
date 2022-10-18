import {IGame} from "../types/IGame";
import {Alert, Button, Card, CardActionArea, CardActions, CardHeader, Grid} from "@mui/material";
import styles from "../styles/Home.module.css";
import {Router, useRouter} from "next/router";
function GameCard(game: IGame) {
    const router = useRouter();

    return(
        <Grid item xs={6} sm={6} key={game.name} >
            <Card className={styles.card} onClick={() => router.push("/game/" + game.name.toLowerCase(), undefined, { shallow: true })}>
                    <CardHeader
                        title={game.name}
                        subheader={<p>{"Players: " + game.players}</p>}
                    />
            </Card>
        </Grid>
    )
}

export default GameCard;