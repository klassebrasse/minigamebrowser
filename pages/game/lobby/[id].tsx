import {useEffect, useState} from "react";
import Head from "next/head";
import {ILobby} from "../../../types/ILobby";
import lobbydata from "../../../data/lobby.json"
import {Container, Box, CardHeader, Card, CardContent, Typography, CardActions} from "@mui/material";
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


function LobbyPage({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {


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

    async function getCards() {
        setHistory(await getHistorical('sweden'));
        setSports(await getHistorical('sports'));
        setCountry(await getHistorical('country'));
        setTech(await getHistorical('tech'));
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        (async () => {
            await getCards();
        })();

        fetchPlayers()

        socket.on('new-user', payload => {
            setPlayers(payload)
        })
    },[])

    function fetchPlayers() {
        socket.emit('joined-lobby', ({ar}: {ar: ILobby[]}) => {
            setPlayers(ar)
        })
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

            <Box sx={{display: 'flex', justifyContent: 'center', p: 10}}>
                {currentCard && (
                    <CurrentCard card={currentCard}/>
                )}
            </Box>
            <Container sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    p: 1,
                    maxWidth: '60vw',

            }}>
                <MainCardDeck category="History" cardClicked={() => cardChosen('history')}/>
                <MainCardDeck category="Sports" cardClicked={() => cardChosen('sports')}/>
                <MainCardDeck category="Country" cardClicked={() => cardChosen('country')}/>
                <MainCardDeck category="Tech" cardClicked={() => cardChosen('tech')}/>
            </Container>

            <Box  sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                p: 1,


            }}>
                {players.map(p => (
                    <OtherPlayerCard key={p.id} player={p}/>
                ))}

            </Box>

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


