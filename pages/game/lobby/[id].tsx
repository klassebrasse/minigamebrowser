import {useEffect, useState} from "react";
import Head from "next/head";
import {ILobby} from "../../../types/ILobby";
import lobbydata from "../../../data/lobby.json"
import {Container, Box, CardHeader, Card, CardContent, Typography, CardActions, Modal} from "@mui/material";
import HeaderBox from "../../../components/HeaderBox";
import PlayerList from "../../../components/PlayerList";
import playersdata from "../../../data/players.json";
import {InferGetServerSidePropsType} from "next";
import socket from "../../../services/socket";
import getHistorical from "../../../services/api";
import fetch, {Headers} from "node-fetch";
import {ICard} from "../../../types/ICard";
import MainCardDeck from "../../../components/GamePlayComponents/MainCardDeck";
import {IPlayer} from "../../../types/IPlayer";
import OtherPlayerCard from "../../../components/GamePlayComponents/OtherPlayerCard";
import CurrentCard from "../../../components/GamePlayComponents/CurrentCard";
import CircularStatic from "../../../components/ProgresSpinner";
import * as React from "react";

function LobbyPage({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [progress, setProgress] = useState(0);

    const [players, setPlayers] = useState<IPlayer[]>([]);
    const [lobby, setLobby] = useState<ILobby>();
    const [currentCard, setCurrentCard] = useState<ICard>();

    const [history, setHistory] = useState<ICard[]>();
    const [currentHistoryCard, setCurrentHistoryCard] = useState(0);
    const [country, setCountry] = useState<ICard[]>();
    const [currentCountryCard, setCurrentCountryCard] = useState(0);
    const [sports, setSports] = useState<ICard[]>();
    const [currentSportsCard, setCurrentSportsCard] = useState(0);
    const [tech, setTech] = useState<ICard[]>();
    const [currentTechCard, setCurrentTechCard] = useState(0);

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    useEffect(() => {
        setProgress(5);
        (async () => {
            await getCards();
            await setPlayers(data.players);
            await sleep(400);
            setProgress(100);
        })();




    },[])

    async function getCards() {
        setHistory(await getHistorical('sweden'));
        setProgress(30)
        setSports(await getHistorical('sports'));
        setProgress(55)
        setCountry(await getHistorical('country'));
        setProgress(85)
        setTech(await getHistorical('tech'));
        setProgress(99)
    }

    function fetchPlayers() {

    }

    function cardChosen(deckChosen){
        switch (deckChosen) {
            case 'history':
                setCurrentCard(history[currentHistoryCard])
                setCurrentHistoryCard(currentHistoryCard + 1)
                break;

            case 'sports':
                setCurrentCard(sports[currentSportsCard])
                setCurrentSportsCard(currentSportsCard + 1)
                break;

            case 'tech':
                setCurrentCard(tech[currentTechCard])
                setCurrentTechCard(currentTechCard + 1)
                break;

            case 'country':
                setCurrentCard(country[currentCountryCard])
                setCurrentCountryCard(currentCountryCard + 1)
                break;
        }
    }

    return(
        <Container sx={{maxWidth: '100vw', minWidth: '100vw'}}>
            <Box sx={{display: 'flex', justifyContent: 'center', p: 5}}>
                <CurrentCard card={currentCard}/>
            </Box>
            <Container sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    p: 1,
                    pb: 5,
                    maxWidth: '60vw',
            }}>
                <MainCardDeck color="#528D70" category="History" cardClicked={() => cardChosen('history')}/>
                <MainCardDeck color="#658FC9" category="Sports" cardClicked={() => cardChosen('sports')}/>
                <MainCardDeck color="#F77EEC" category="Country" cardClicked={() => cardChosen('country')}/>
                <MainCardDeck color="#FC8F3A" category="Tech" cardClicked={() => cardChosen('tech')}/>
            </Container>

            <Box  sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                p: 1,


            }}>
                {players.filter(p => p.id !== socket.id).map(p => (
                    <OtherPlayerCard key={p.id} player={p}/>
                ))}
            </Box>
            <Box>
                <Box sx={{ border: 1, borderRadius: 3, borderWidth:2, backgroundColor: "#264653", width: "75vw", m: 'auto', mt: 5, pt: 10}}>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        p: 1,
                        m: 1,

                    }}>
                        <Typography sx={{m: 'auto'}}>123</Typography>
                        <Typography sx={{m: 'auto'}}>Score: 213</Typography>
                    </Box>

                </Box>
            </Box>

            
            
            <Modal open={progress < 100}>
                <Box sx={{  position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    }} >
                    <CircularStatic progress={progress}/>
                </Box>

            </Modal>
        </Container>
    )
}

export async function getServerSideProps(context) {
    //YuAhR6x2/fckgC8JWJOcBA==K7gB4sAqTFD250vK
    let data: ILobby = lobbydata.find(lid => lid.id == context.query.id)
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
    data.id = context.query.id
    return {
        props: {data}, // will be passed to the page component as props
    }
}
export default LobbyPage;


