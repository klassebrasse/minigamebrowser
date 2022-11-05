import {useEffect, useState} from "react";
import Head from "next/head";
import {Container, Box, Modal, Typography, Input, Button} from "@mui/material";
import HeaderBox from "../../components/HeaderBox";
import PlayerList from "../../components/PlayerList";
import {ILobby} from "../../types/ILobby";
import {useRouter} from "next/router";
import {useSocket} from "../../contexts/socketContext";

function GamePage() {
    const socket = useSocket();
    const router = useRouter();
    const paramId = router.query.id

    const [lobby, setLobby] = useState<ILobby>()
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [username, setUsername] = useState("");

    useEffect(()=>{
        if(!router.isReady) return;
        console.log(paramId)
        socket.emit('get lobby data', paramId, false, callback => {
            setLobby(callback.lobby)
        })

        socket.on('new user joined', lobby => {
            console.log(lobby)
            if (lobby){
                setLobby(prevState => {
                    let temp = {
                        ...prevState,
                        lobby: {...prevState}
                    }
                    temp.players = lobby.players;

                    return temp;
                })
            }
            else {
                setLobby(lobby)
            }
        })

        socket.on('play', (lobbyId) => {
            router.push(`/game/lobby/${lobbyId}`);
        });

    },[router.isReady])

    function newUser() {
        socket.emit('join room and get lobby data', paramId, username, socket.id);
        setIsModalOpen(false)
    }

    function startGame(){
        socket.emit('start game', paramId);
    }
    return(
        <Container>
            {lobby ? (
                <div>
                    <Head>
                        <title>{paramId}</title>
                    </Head>
                    <HeaderBox Header={paramId} SubHeader="Invite your friends and start playing"/>
                    <Box sx={{marginX: "auto",
                        marginY: 5,
                        display: "flex",
                        width: "60vw", height: "10vh", justifyContent: "center", color: "#2a9d8f"}}>
                        <Box sx={{marginRight:20, border: 2, paddingX: 5, borderRadius: 3, ":hover":{cursor: "pointer"}}} onClick={() => startGame()}>
                            <h1>Play</h1>
                        </Box>
                        <Box sx={{marginLeft:20, border: 2, paddingX: 5, borderRadius: 3, ":hover":{cursor: "pointer"}}} onClick={()=> alert("Settings")}>
                            <h1>Settings</h1>
                        </Box>


                    </Box>
                    <PlayerList players={lobby.players}/>

                    <Modal open={isModalOpen}>
                        <Box sx={style}>
                            <h2 style={{color: "#96B1AC"}}>
                                Insert username
                            </h2>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                                <Input autoFocus sx={{color: "#96B1AC"}} onChange={(event) => setUsername(event.target.value)}/>
                                <Button style={{color: "#96B1AC", borderColor: "#96B1AC"}} variant="outlined" onClick={() => newUser()}>
                                    Lets Go
                                </Button>
                            </Box>

                        </Box>
                    </Modal>
                </div>
            ) : (
                <h1>loading</h1>
            )}


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
    p: 4,
};

export default GamePage;


