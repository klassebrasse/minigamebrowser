import {useEffect, useState} from "react";
import Head from "next/head";
import {ILobby} from "../../../types/ILobby";
import lobbydata from "../../../data/lobby.json"
import {Container, Box, CardHeader, Card, CardContent, Typography, CardActions, Modal, Button} from "@mui/material";
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

function LobbyPage({ data, cards }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const Lobby: ILobby = data;
    const [mainPlayerData, setMainPlayerData] = useState<IPlayer>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [progress, setProgress] = useState(0);

    const [players, setPlayers] = useState<IPlayer[]>([]);
    const [lobby, setLobby] = useState<ILobby>(data);
    const [currentCard, setCurrentCard] = useState<ICard>();

    const [history, setHistory] = useState<ICard[]>();
    const [currentHistoryCard, setCurrentHistoryCard] = useState(0);
    const [country, setCountry] = useState<ICard[]>();
    const [currentCountryCard, setCurrentCountryCard] = useState(0);
    const [sports, setSports] = useState<ICard[]>();
    const [currentSportsCard, setCurrentSportsCard] = useState(0);
    const [tech, setTech] = useState<ICard[]>();
    const [currentTechCard, setCurrentTechCard] = useState(0);

    const [currentTurn, setCurrentTurn] = useState<IPlayer>(Lobby.players[3]);

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    useEffect(() => {
        if(progress !== 100){
            (async () => {
                await getCards();
                await getFirstCards();
                setProgress(100)
            })()
        }

        //alert(currentTurn.nickname)

/*        if(progress !== 100){
            setProgress(5);
            //setLobby(Lobby);

            (async () => {
                await getCards();
                await sleep(400);
                setProgress(100)
            })()
        }*/


    },[])
    async function getCards() {
        setHistory(cards[0]);
        setSports(cards[1]);
        setCountry(cards[2]);
        setTech(cards[3]);
    }
    function aja(){
        console.log(lobby)
        let newLobbyData = lobby;
        newLobbyData.players[0].nickname = "JAJJAJA"
        setLobby(newLobbyData);
        console.log(lobby)
    }
    async function getFirstCards(){
        let index = 0;
        await lobby.players.forEach(p => {
            if(p.cards.length < 1){
                p.cards.push(cards[0][index]);
            }
            index++;
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

    function beforeAction(index: number, pid: string){
        const playerCards = lobby.players[0].cards;
        if (currentCard.year < playerCards[index].year){
            alert("Yes. " + currentCard.year + " is before " + playerCards[index].year)
        }
        else {
            alert("wrong")
        }
    }

    function afterAction(index: number, pid: string){
        const playerCards = lobby.players[0].cards;
        if (currentCard.year > playerCards[index].year){
            alert("Yes. " + currentCard.year + " is after " + playerCards[index].year)
        }
        else {
            alert("wrong")
        }
    }

    return(
        <Container sx={{maxWidth: '100vw', minWidth: '100vw'}}>
            <Button variant="outlined" onClick={() => aja()}/>
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
                {lobby.players.filter(p => p.id !== "999").map(p => (
                    <OtherPlayerCard key={p.id} player={p} beforeButton={(index, pid) => beforeAction(index, pid)} afterButton={(index, pid) => afterAction(index, pid)}/>
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

                        <Typography sx={{m: 'auto'}}>{lobby.players.find(p => p.id == "999") && lobby.players.find(p => p.id == "999").nickname}</Typography>
                        <Typography sx={{m: 'auto'}}>Score: {lobby.players.find(p => p.id == "999") && lobby.players.find(p => p.id == "999").score}</Typography>


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
    let data: ILobby = lobbydata.find(lid => lid.id == context.query.id);

    //If socket.id exists on lobby: Authorized
    let socketId = data.players.find(p => p.id == socket.id);

    let cards: ICard[] = [];

    //socket.emit('get lobby', (context.query.id, callback) => {
    //      callback.cards
    //      callback.lobby
    //    }

    cards.push(await getHistorical('sweden'));
    cards.push(await getHistorical('sports'));
    cards.push(await getHistorical('country'));
    cards.push(await getHistorical('tech'));




    if(!data){
        return {
            notFound: true
        }
    }



    return {
        props: {data, cards}, // will be passed to the page component as props
    }
}
export default LobbyPage;