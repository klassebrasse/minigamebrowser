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
      <Container style={{backgroundColor: "red", height: "100vh", minWidth: "100vw"}}>
          <Box m="auto"
              display="flex"
              width="60vw" height="40vh"
              bgcolor="lightblue"
          >
              <Box m="auto">
                  1. Box (margin: auto)
              </Box>
          </Box>
          <Container style={{backgroundColor: "blue", width: "30vw"}}>
              <Grid container rowSpacing={2} columnSpacing={5}>
                  {gamesdata.map(game => (
                      <Grid item xs={6} sm={6} key={game.name} >
                          <Card className={styles.card}>
                              <CardHeader
                                  title={game.name}
                                  subheader={game.players}
                              />
                          </Card>
                      </Grid>
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