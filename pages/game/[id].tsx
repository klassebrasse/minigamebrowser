import {useEffect, useState} from "react";
import Head from "next/head";
import {IGame} from "../../types/IGame";
import gamesdata from "../../data/games.json"
import {Container, Box, Modal, Typography, Input, Button} from "@mui/material";
import HeaderBox from "../../components/HeaderBox";
import PlayerList from "../../components/PlayerList";
import playersdata from "../../data/players.json";
import {ILobby} from "../../types/ILobby";
import lobbydata from "../../data/lobby.json";
import {InferGetServerSidePropsType} from "next";
import {socket} from "../../services/socket";
import {useRouter} from "next/router";


function GamePage({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const Lobby: ILobby = data;

    const router = useRouter();
    const [players, setPlayers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [username, setUsername] = useState("");

    useEffect(()=>{
        socket.emit('connect to room', Lobby.id);

        socket.emit('load users', Lobby.id, (callback) => {
            setPlayers(callback.players)
        })

        socket.on('update users from server', players => {
            setPlayers(players)
        })

        socket.on('play', () => {
            router.push('/game/lobby/234');
        });

        //setPlayers(Lobby.players)

    },[])

    function newUser() {
        socket.emit('new user', Lobby.id, username, socket.id);
        console.log("SOCKETIDIIDIDID:       " + socket.id)
        setIsModalOpen(false)
    }

    function startGame(){
        socket.emit('start game', Lobby.id);
    }
    return(
        <Container>
            <Head>
                <title>{Lobby.id.toUpperCase()}</title>
            </Head>
            <HeaderBox Header={Lobby.id.toUpperCase()} SubHeader="Invite your friends and start playing"/>
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
            <PlayerList players={players}/>

            <Modal open={isModalOpen}>
                <Box sx={style}>
                    <Typography>
                        Insert username
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                        <Input autoFocus sx={{color: "white"}} onChange={(event) => setUsername(event.target.value)}/>
                        <Button variant="outlined" onClick={() => newUser()}>
                            Lets Go
                        </Button>
                    </Box>

                </Box>
            </Modal>

        </Container>
    )
}

export async function getServerSideProps(context) {
    //YuAhR6x2/fckgC8JWJOcBA==K7gB4sAqTFD250vK

    const data = lobbydata.find(lid => lid.id == context.query.id);
    /*    const meta = {
            'X-Api-Key': 'YuAhR6x2/fckgC8JWJOcBA==K7gB4sAqTFD250vK'
        };
        const headers = new Headers(meta);

        var data;
        const response = fetch('https://api.api-ninjas.com/v1/historicalevents?text=sweden', {headers})
            .then(res => res.text())
            .then(text => console.log(text));*/






    if(!data){

        return {
            notFound: true
        }
    }

    return {
        props: {data}, // will be passed to the page component as props
    }
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


