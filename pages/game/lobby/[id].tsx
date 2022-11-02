import * as React from "react";
import {useEffect, useState} from "react";
import {ILobby} from "../../../types/ILobby";
import {Box, Button, Container, Modal, Typography} from "@mui/material";
import {InferGetServerSidePropsType} from "next";
import socket from "../../../services/socket";
import {ICard, ICardDeck} from "../../../types/ICard";
import MainCardDeck from "../../../components/GamePlayComponents/MainCardDeck";
import {IPlayer} from "../../../types/IPlayer";
import OtherPlayerCard from "../../../components/GamePlayComponents/OtherPlayerCard";
import CurrentCard from "../../../components/GamePlayComponents/CurrentCard";
import CircularStatic from "../../../components/ProgresSpinner";
import CardOnBoard from "../../../components/GamePlayComponents/CardOnBoard";
import {FaDice} from "react-icons/fa";
import Grid from "@mui/system/Unstable_Grid";
import SelectSvg from "../../../public/SelectSvg";


function LobbyPage({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const Lobby: ILobby = data;
    const [mainPlayerData, setMainPlayerData] = useState<IPlayer>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [progress, setProgress] = useState(0);

    const [lobby, setLobby] = useState<ILobby>(data);
    const [currentCard, setCurrentCard] = useState<ICard>();
    const [currentCategory, setCurrentCategory] = useState("");

    const [history, setHistory] = useState<ICardDeck>();
    const [currentHistoryCard, setCurrentHistoryCard] = useState(0);
    const [country, setCountry] = useState<ICardDeck>();
    const [currentCountryCard, setCurrentCountryCard] = useState(0);
    const [sports, setSports] = useState<ICardDeck>();
    const [currentSportsCard, setCurrentSportsCard] = useState(0);
    const [tech, setTech] = useState<ICardDeck>();
    const [currentTechCard, setCurrentTechCard] = useState(0);

    const [currentTurn, setCurrentTurn] = useState<IPlayer>(Lobby.players[3]);

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    useEffect(() => {

        if(!data){
            setLobby(data)
            console.log('loop?')
        }
        if(progress !== 100){
            (async () => {

                setProgress(100)
            })()
        }

    })



    function cardChosen(deckChosen){
        alert('not implemented')
/*        switch (deckChosen) {
            case 'history':
                console.log(history)
                setCurrentCard(history.cards[currentHistoryCard])
                setCurrentHistoryCard(currentHistoryCard + 1)
                setCurrentCategory('history')
                break;

            case 'sports':
                setCurrentCard(sports.cards[currentSportsCard])
                setCurrentSportsCard(currentSportsCard + 1)
                setCurrentCategory('sports')
                break;

            case 'tech':
                setCurrentCard(tech.cards[currentTechCard])
                setCurrentTechCard(currentTechCard + 1)
                setCurrentCategory('tech')
                break;

            case 'country':
                setCurrentCard(country.cards[currentCountryCard])
                setCurrentCountryCard(currentCountryCard + 1)
                setCurrentCategory('country')
                break;
        }*/
    }

    function randomCard(){
        socket.emit('random card', '234', callback => {
            const newCard = callback.lobby.currentCard;
            console.log('random' + callback.lobby.currentCard.year)
            setLobby(prevState => {
                return {
                   ...prevState,
                   currentCard: newCard
               };
            })
        })
    }

    function beforeAction(index: number, pid: string){
        const playerCards = lobby.players.find(p => p.id === pid).cards;
        const playerIndex = lobby.players.findIndex(p => p.id === pid);
        if (currentCard.year < playerCards[index].year || currentCard.year === playerCards[index].year){
            currentCard.isSafe = false;
            setLobby(prevState => {
                let temp = {
                    ...prevState,
                    players: [...prevState.players]
                }
                temp.players[playerIndex].cards.push(currentCard);

                return temp;
            })
        }
        else {
            alert("wrong")
            removeUnsafeCards(playerIndex)
            changeTurn();
        }
    }
    function afterAction(index: number, pid: string){
        const playerCards = lobby.players.find(p => p.id === pid).cards;
        const playerIndex = lobby.players.findIndex(p => p.id === pid);
        //If last card
        if (playerCards.length === index + 1){
            if (currentCard.year > playerCards[index].year || currentCard.year === playerCards[index].year){
                currentCard.isSafe = false;
                setLobby(prevState => {

                    let temp = {
                        ...prevState,
                        players: [...prevState.players]
                    }
                    temp.players[playerIndex].cards.push(currentCard);

                    return temp;
                })

            }
            else {
                alert("wrong")
                removeUnsafeCards(playerIndex)
                changeTurn();
            }
        }
        else {
            if ((currentCard.year > playerCards[index].year && currentCard.year < playerCards[index + 1].year) || (currentCard.year === playerCards[index].year && currentCard.year === playerCards[index + 1].year)){
                currentCard.isSafe = false;
                setLobby(prevState => {

                    let temp = {
                        ...prevState,
                        players: [...prevState.players]
                    }
                    temp.players[playerIndex].cards.push(currentCard);

                    return temp;
                })
            }
            else {
                alert("wrong");
                removeUnsafeCards(playerIndex)
                changeTurn();
            }
        }

    }

    const mySocketId = "999";
    const [indexTurn, setIndexTurn] = useState(3);

    function changeTurn(){
        setLobby(prevState => {
            let temp = {
                ...prevState,
                lobby: {...prevState}
            }
            temp.players[indexTurn].cards.forEach(c => c.isSafe = true)

            return temp;
        })

        setCurrentTurn(lobby.players[indexTurn]);
        if (indexTurn == 3)
            setIndexTurn(0);
        else
            setIndexTurn(indexTurn + 1);

        randomCard();
    }

    function removeUnsafeCards(playerIndex: number){
        setLobby(prevState => {
            let temp = {
                ...prevState,
                players: [...prevState.players]
            }
            temp.players[playerIndex].cards = temp.players[playerIndex].cards.filter(c => c.isSafe === true)

            return temp;
        })
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
                <CurrentCard card={lobby.currentCard}/>
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
    //let data: ILobby;

    const data = await getDataFromServer(context.query.id)

    if(!data){
        return {
            notFound: true
        }
    }

    return {
        props: {data}, // will be passed to the page component as props
    }
}
export default LobbyPage;

/*async function getDataFromServer(lid): Promise<{ data: ILobby; cards: ICard[] }> {
    let data: ILobby;
    let cards: ICard[];
    await socket.emit('connect to lobby', lid, async callback => {
        [[data], cards] = await Promise.all([Promise.all([callback.lobby]), callback.cards]);
    })
    return {data, cards};
}*/

function getDataFromServer(lid){
    return new Promise(resolve => socket.emit('connect to lobby', lid, callback => resolve(callback.lobby)));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));