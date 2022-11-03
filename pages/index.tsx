import styles from '../styles/Home.module.css';
import Head from 'next/head'
import Image from 'next/image'
import GameGrid from "../components/GameGrid";
import GameCard from "../components/GameCard";
import {Box, Button, Card, CardContent, CardHeader, Container, Divider, Grid} from "@mui/material";
import gamesdata from "../data/games.json"
import HeaderBox from "../components/HeaderBox";
import {useContext, useEffect} from "react";
import {SocketContext} from "../contexts/socketContext";
import {useRouter} from "next/router";

export default function Home() {
    const socket = useContext(SocketContext);
    const router = useRouter();

    function createLobby() {
        socket.emit('create lobby', socket.id)
    }

    useEffect(() => {
        socket.on('lobby created', lobbyId => {
            router.push(`/game/${lobbyId}`);
        })
    }, [])


  return (
      <Container>
          <HeaderBox Header="MINIGAMES" SubHeader="PICK A GAME"/>
          <Container style={{width: "30vw"}}>
              <Button onClick={() => createLobby()}>
                  <h1>Create Lobby</h1>
              </Button>
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