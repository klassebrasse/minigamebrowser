import {useEffect, useState} from "react";
import Head from "next/head";
import {ILobby} from "../../../types/ILobby";
import lobbydata from "../../../data/lobby.json"
import {
    Container,
    Box,
    CardHeader,
    Card,
    CardContent,
    Typography,
    CardActions,
    Modal,
    Button,
    IconButton
} from "@mui/material";
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
import CardOnBoard from "../../../components/GamePlayComponents/CardOnBoard";
import {FaDice} from "react-icons/fa";
import Grid from "@mui/system/Unstable_Grid";
import {GiHorizontalFlip} from "react-icons/gi";
import SelectSvg from "../../../public/SelectSvg";


function LobbyPage({ data, cards }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const Lobby: ILobby = data;
    const [mainPlayerData, setMainPlayerData] = useState<IPlayer>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [progress, setProgress] = useState(0);

    const [lobby, setLobby] = useState<ILobby>(data);
    const [currentCard, setCurrentCard] = useState<ICard>();
    const [currentCategory, setCurrentCategory] = useState("");

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


    },[lobby])
    async function getCards() {
        setHistory(cards[0]);
        setSports(cards[1]);
        setCountry(cards[2]);
        setTech(cards[3]);
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
                setCurrentCategory('history')
                break;

            case 'sports':
                setCurrentCard(sports[currentSportsCard])
                setCurrentSportsCard(currentSportsCard + 1)
                setCurrentCategory('sports')
                break;

            case 'tech':
                setCurrentCard(tech[currentTechCard])
                setCurrentTechCard(currentTechCard + 1)
                setCurrentCategory('tech')
                break;

            case 'country':
                setCurrentCard(country[currentCountryCard])
                setCurrentCountryCard(currentCountryCard + 1)
                setCurrentCategory('country')
                break;
        }
    }

    function randomCard(){
        const randomDeck = Math.floor(Math.random() * 4);
        switch (randomDeck) {
            case 0:
                setCurrentCard(history[currentHistoryCard])
                setCurrentHistoryCard(currentHistoryCard + 1)
                setCurrentCategory('history')
                break;

            case 1:
                setCurrentCard(sports[currentSportsCard])
                setCurrentSportsCard(currentSportsCard + 1)
                setCurrentCategory('sports')
                break;

            case 2:
                setCurrentCard(tech[currentTechCard])
                setCurrentTechCard(currentTechCard + 1)
                setCurrentCategory('tech')
                break;

            case 3:
                setCurrentCard(country[currentCountryCard])
                setCurrentCountryCard(currentCountryCard + 1)
                setCurrentCategory('country')
                break;

        }
    }

    function beforeAction(index: number, pid: string){
        const playerCards = lobby.players.find(p => p.id === pid).cards;

        if (currentCard.year < playerCards[index].year || currentCard.year === playerCards[index].year){
            alert("Yes. " + currentCard.year + " is before " + playerCards[index].year)
            let temp = lobby;
            temp.players.find(p => p.id === pid).cards.push(currentCard);
            setLobby(temp);
        }
        else {
            alert("wrong")
            changeTurn();
        }
    }

    function afterAction(index: number, pid: string){
        const playerCards = lobby.players.find(p => p.id === pid).cards;

        //If last card
        if (playerCards.length === index + 1){
            if (currentCard.year > playerCards[index].year || currentCard.year === playerCards[index].year){
                alert("Yes. " + currentCard.year + " is after " + playerCards[index].year)
                let temp = lobby;
                temp.players.find(p => p.id === pid).cards.push(currentCard);
                setLobby(temp);
            }
            else {
                alert("wrong")
                changeTurn();
            }
        }
        else {
            if ((currentCard.year > playerCards[index].year && currentCard.year < playerCards[index + 1].year) || (currentCard.year === playerCards[index].year && currentCard.year === playerCards[index + 1].year)){
                alert("Yes. " + currentCard.year + " is after " + playerCards[index].year + ". And " + currentCard.year + " is before " + playerCards[index + 1].year)
                let temp = lobby;
                temp.players.find(p => p.id === pid).cards.push(currentCard);
                setLobby(temp);
            }
            else {
                alert("wrong")
                changeTurn();
            }
        }

    }
    const mySocketId = "999";
    const [indexTurn, setIndexTurn] = useState(0);
    function changeTurn(){
        setCurrentTurn(lobby.players[indexTurn]);
        if (indexTurn == 3)
            setIndexTurn(0);
        else
            setIndexTurn(indexTurn + 1);

        randomCard();
    }

    function maxWitdh(){
        let x = lobby.players.find(p => p.id === "999").cards.length;
        return `${100 / (x + 1)}vw`
    }
    return(
        <Container sx={{maxWidth: '100vw', minWidth: '100vw'}}>
            <Button variant={"outlined"} onClick={() => changeTurn()}>
                <Typography>
                    End turn
                </Typography>
            </Button>
            <Button onClick={() => randomCard()}>
                <FaDice size={42}/>
            </Button>
            <h3>{currentTurn.nickname}s turn</h3>
            <Box sx={{display: 'flex', justifyContent: 'center', p: 5, flexDirection: 'column'}}>
                <Typography sx={{m: 'auto'}}>
                    {currentCategory}
                </Typography>
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
                    <OtherPlayerCard key={p.id} player={p} beforeButton={(index, pid) => beforeAction(index, pid)} afterButton={(index, pid) => afterAction(index, pid)} isPlayersTurn={currentTurn.id === mySocketId}/>
                ))}
            </Box>
            <Box>
                <Box sx={{ border: 1, borderRadius: 3, borderWidth:2, backgroundColor: "#264653", width: "75vw", m: 'auto', mt: 5}}>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        p: 1,
                        m: 1,
                        backgroundColor: "lightBlue"

                    }}>

                        {lobby.players.find(p => p.id === "999").cards.sort((a,b) => parseInt(a.year) - parseInt(b.year)).map((c, index) => (
                            <Grid key={index} sx={{display: 'flex', flexDirection: "row", m: 'auto'}}>
                                {index === 0 && (
                                   <Button disabled={currentTurn.id !== mySocketId} onClick={() => beforeAction(index, "999")}>
                                    <Container>
                                        <SelectSvg/>
                                    </Container>

                                    </Button>
                                )}
                                <CardOnBoard card={c}/>
                                <Button disabled={currentTurn.id !== mySocketId} onClick={() => afterAction(index, "999")}>
                                    <Container>
                                        <SelectSvg/>
                                    </Container>
                                </Button>
                            </Grid>

                        ))}
                    </Box>
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