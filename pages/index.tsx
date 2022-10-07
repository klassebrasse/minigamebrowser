import styles from '../styles/Home.module.css';
import Head from 'next/head'
import Image from 'next/image'
import GameGrid from "../components/GameGrid";
import GameCard from "../components/GameCard";
import {Box, Card, CardContent, CardHeader, Container, Divider, Grid} from "@mui/material";
import gamesdata from "../data/games.json"
import {IGame} from "../types/IGame";

export default function Home() {
  return (
      <Container className={styles.mainConatiner} style={{height: "100vh", minWidth: "100vw"}}>
          <Box m="auto"
              display="flex"
              width="60vw" height="40vh"


          >
              <Box m="auto" style={{textAlign: "center", color: "darkslategrey"}}>
                  <h1>JAJA</h1>
                  <h1>PICK A GAME</h1>
              </Box>
          </Box>
          <Container style={{width: "30vw"}}>
              <Grid container rowSpacing={2} columnSpacing={5}>
                  {gamesdata.map(game => (
                      <GameCard name={game.name} players={game.players} key={game.name}/>
                  ))}
              </Grid>
          </Container>


      </Container>



  )
}

/*
        <div className={styles.grid} style={{margin: "auto"}}>
            {gamesdata.map((game: IGame) =>
                <div className={styles.card} key={game.name}>
                    <GameCard name={game.name} players={game.players} />
                </div>
            )}
        </div>
 */