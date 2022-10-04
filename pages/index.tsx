import Head from 'next/head'
import Image from 'next/image'
import GameGrid from "../components/GameGrid";
import GameCard from "../components/GameCard";
import {Container, Grid} from "@mui/material";
import gamesdata from "../data/games.json"
import {IGame} from "../types/IGame";

export default function Home() {
  return (
      <Container>
          <Grid container spacing={2} alignItems="center" >
              {gamesdata.map((game: IGame) =>
                  <Grid item key={game.name} md={5} >
                      <GameCard name={game.name} players={game.players} />
                  </Grid>
              )}
          </Grid>
      </Container>


  )
}
