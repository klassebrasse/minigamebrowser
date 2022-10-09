import {useEffect, useState} from "react";
import Head from "next/head";
import {IGame} from "../../types/IGame";
import gamesdata from "../../data/games.json"
import {Container, Box} from "@mui/material";
import HeaderBox from "../../components/HeaderBox";
import PlayerList from "../../components/PlayerList";
import playersdata from "../../data/players.json";


function GamePage({game}: {game: IGame}) {

    const [players, setPlayers] = useState([]);
    useEffect(()=>{
        setPlayers(playersdata)
        console.log(players)
    },[players])
    return(
        <Container>
            <Head>
                <title>{game.name.toUpperCase()}</title>
            </Head>
            <HeaderBox Header={game.name.toUpperCase()} SubHeader="Invite your friends and start playing"/>
            <Box sx={{marginX: "auto",
                marginY: 5,
                display: "flex",
                width: "60vw", height: "10vh", justifyContent: "center", color: "#2a9d8f"}}>
                <Box sx={{marginRight:20, border: 2, paddingX: 5, borderRadius: 3, ":hover":{cursor: "pointer"}}} onClick={()=> alert("Play")}>
                    <h1>Play</h1>
                </Box>
                <Box sx={{marginLeft:20, border: 2, paddingX: 5, borderRadius: 3, ":hover":{cursor: "pointer"}}} onClick={()=> alert("Settings")}>
                    <h1>Settings</h1>
                </Box>


            </Box>
            <PlayerList players={players}/>
        </Container>
    )
}

export async function getStaticPaths(game: any) {
    let paths = gamesdata.map((game: { name: string; }) => {
        return {
            params: {
                name: game.name.toLowerCase().split(" ").join("-")
            }
        }
    });

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({params}: {params: { name: string}}) {
    const game = gamesdata.find(c => c.name.toLowerCase() == params.name.toLowerCase());
    return {
        props: {
            game
        }
    }
}

export default GamePage;


