import styles from '../styles/Home.module.css'
import gamesdata from '../data/games.json'
import {IGame} from "../types/IGame";
import GameCard from "./GameCard";

function GameGrid() {
    const listItems = gamesdata.map((g) => <GameCard name={g.name} players={g.players} key={g.name}/>)
    return(
        <div className={styles.Grid}>
            {listItems}

        </div>
    )
}

export default GameGrid;