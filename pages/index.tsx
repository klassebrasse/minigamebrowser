import GameCard from "../components/GameCard";
import {Box, Button, Container, Grid, Input, Modal, Typography} from "@mui/material";
import gamesdata from "../data/games.json"
import HeaderBox from "../components/HeaderBox";
import {useSocket} from "../contexts/socketContext";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {BeatLoader} from "react-spinners";

export default function Home() {
    const socket = useSocket();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    function createLobby() {
        setIsOpen(true);
        socket.emit('create lobby', socket.id)
    }

    useEffect(() => {
        socket.on('lobby created', lobbyId => {
            setIsOpen(true)
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

          <Modal open={isOpen}>
              <Box sx={style}>
                  <h1 style={{color: "#96B1AC"}}>
                      Creating lobby
                  </h1>
                  <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                      <BeatLoader size={28} color="#2a9d8f"/>
                  </Box>
              </Box>
          </Modal>

      </Container>
  )
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#264653',
    border: '2px solid #000',
    boxShadow: 24,
    p: 3,
    textAlign: 'center'
};

/*
        <div className={styles.grid} style={{margin: "auto"}}>
            {gamesdata.map((game: IGame) =>
                <div className={styles.card} key={game.name}>
                    <GameCard name={game.name} players={game.players} />
                </div>
            )}
        </div>
 */