import * as React from "react";
import {useEffect, useState} from "react";
import {ILobby} from "../../../types/ILobby";
import {Box, Button, Container, Modal, Typography} from "@mui/material";
import OtherPlayerCard from "../../../components/GamePlayComponents/OtherPlayerCard";
import CurrentCard from "../../../components/GamePlayComponents/CurrentCard";
import CardOnBoard from "../../../components/GamePlayComponents/CardOnBoard";
import {FaDice} from "react-icons/fa";
import Grid from "@mui/system/Unstable_Grid";
import SelectSvg from "../../../public/SelectSvg";
import {useRouter} from "next/router";
import {useSocket} from "../../../contexts/socketContext";



function LobbyPage() {
    const socket = useSocket();
    const router = useRouter();
    const data = router.query.id;

    const [isCorrectAnswer, setIsCorrectAnswer] = useState(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [progress, setProgress] = useState(0);

    const [isEndTurnDisabled, setIsEndTurnDisabled] = useState(true);
    const [isRandomCardDisabled, setIsRandomCardDisabled] = useState(false);
    const [isAllowedToGuess, setIsAllowedToGuess] = useState(false);
    const [lobby, setLobby] = useState<ILobby>(null);


    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    function getDataFromServer(lid): Promise<ILobby> {
        return new Promise(resolve => socket.emit('join room and get lobby data', lid, callback => resolve(callback.lobby)));
    }

    useEffect(() => {
/*        (async () => {
            //Todo: Callback see if user is allowed
            setLobby(await getDataFromServer(data))
        })()*/
        socket.emit('get lobby data', data, true, callback => {
            setLobby(callback.lobby)
        })


        socket.on('random card', (newLobby) => {
            setIsCorrectAnswer(null)
            console.log('random card')
            const newCard = newLobby.currentCard;
            console.log('random' + newLobby.currentCard.year)
            setLobby(prevState => {
                return {
                    ...prevState,
                    currentCard: newCard,
                    currentCat: newLobby.currentCat
                };
            })
            setIsAllowedToGuess(true)
        })

        socket.on('turn changed', (newLobby) => {
            setIsCorrectAnswer(null)
            setLobby(prevState => {
                let temp = {
                    ...prevState,
                    lobby: {...prevState}
                }
                temp.players = newLobby.players;
                temp.currentTurn = newLobby.currentTurn;

                return temp;
            })
            setIsAllowedToGuess(false)
            setIsEndTurnDisabled(true)
            setIsRandomCardDisabled(false)
        })

        socket.on('guess checked', (newLobby, guessIs) => {
            console.log('guess checked')

            setIsCorrectAnswer(guessIs)

            setLobby(prevState => {
                let temp = {
                    ...prevState,
                    lobby: {...prevState}
                }
                temp.players = newLobby.players;
                temp.currentTurn = newLobby.currentTurn;

                return temp;
            })
            setIsAllowedToGuess(false)
            setIsEndTurnDisabled(!guessIs)
            setIsRandomCardDisabled(false)
        })


    }, [])


    function cardChosen(deckChosen) {
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

    function randomCard() {
        setIsEndTurnDisabled(true)
        setIsRandomCardDisabled(true)
        socket.emit('random card', lobby.id);
    }

    function beforeAction(index: number, pid: string) {
        console.log('sending guess' + pid)
        socket.emit('guess before', data, index, pid);
    }

    function afterAction(index: number, pid: string) {
        console.log('sending guess')
        socket.emit('guess after', data, index, pid)
    }

    function changeTurn() {
        //Todo: Ide att skicka socket.id för att players.findIndex på serverside
        socket.emit('change turn', lobby.id)
    }

    function maxWitdh() {
        let x = lobby.players.find(p => p.id === socket.id).cards.length;
        return `${100 / (x + 1)}vw`
    }

    function correctOrFalseAnswerText() {
        if(isCorrectAnswer !== null){
            return isCorrectAnswer ? (
                    <Box sx={{textAlign: 'center'}}>
                        <Typography color='#2a9d8f' fontSize={22} fontWeight='bold'>Correct</Typography>
                        <Typography color='#2a9d8f' fontSize={22} fontWeight='bold'>{lobby.currentCard.year}</Typography>
                    </Box>
                )
                : (
                    <Box sx={{textAlign: 'center'}}>
                        <Typography color='#2a9d8f' fontSize={22} fontWeight='bold'>Incorrect</Typography>
                        <Typography color='#2a9d8f' fontSize={22} fontWeight='bold'>{lobby.currentCard.year}</Typography>
                    </Box>
                )
        }
        else {
            return ''
        }
    }

    function getDisableEndTurn(): boolean {
        if (socket.id === lobby.players[lobby.currentTurn].id)
        {
            return isEndTurnDisabled;
        }
        else {
            return true
        }
    }
    function getDisableRandomCard(): boolean {
        if (socket.id === lobby.players[lobby.currentTurn].id)
        {
            return isRandomCardDisabled;
        }
        else {
            return true
        }
    }

    return (
        <Container sx={{maxWidth: '100vw', minWidth: '100vw'}}>
            {!lobby ? (
                <h1>loading</h1>
            ) : (
                <div>
                    <Button disabled={getDisableEndTurn()} variant={"outlined"} onClick={() => changeTurn()}>
                        <Typography>
                            End turn
                        </Typography>
                    </Button>
                    <Button disabled={getDisableRandomCard()} onClick={() => randomCard()}>
                        <FaDice color='#2a9d8f' size={42}/>
                    </Button>
                    <h3>{lobby.players[lobby.currentTurn].nickname}s turn</h3>
                    <Box sx={{display: 'flex', justifyContent: 'center', p: 5, flexDirection: 'column'}}>
                        <Typography sx={{m: 'auto'}}>
                            {lobby.currentCat}
                        </Typography>
                        <CurrentCard card={lobby.currentCard}/>
                    </Box>
                    <Container sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        p: 1,
                        pb: 5,
                        maxWidth: '30vw',
                        maxHeight: '10vh',
                        minHeight: 100,
                        backgroundColor: '#264653',
                        borderRadius: 2
                    }}>
{/*                        <MainCardDeck color="#528D70" category="History" cardClicked={() => cardChosen('history')}/>
                        <MainCardDeck color="#658FC9" category="Sports" cardClicked={() => cardChosen('sports')}/>
                        <MainCardDeck color="#F77EEC" category="Country" cardClicked={() => cardChosen('country')}/>
                        <MainCardDeck color="#FC8F3A" category="Tech" cardClicked={() => cardChosen('tech')}/>*/}
                        {correctOrFalseAnswerText()}
                    </Container>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        p: 1,


                    }}>
                        {lobby.players.filter(p => p.id !== socket.id).map(p => (
                            <OtherPlayerCard key={p.id} player={p}
                                             beforeButton={(index, pid) => beforeAction(index, pid)}
                                             afterButton={(index, pid) => afterAction(index, pid)}
                                             isPlayersTurn={lobby.players[lobby.currentTurn].id === socket.id}/>
                        ))}
                    </Box>
                    <Box>
                        <Box sx={{
                            border: 1,
                            borderRadius: 3,
                            borderWidth: 2,
                            backgroundColor: "#264653",
                            width: "75vw",
                            m: 'auto',
                            mt: 5
                        }}>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                p: 1,
                                m: 1,
                                backgroundColor: "lightBlue"

                            }}>

                                {lobby.players.find(p => p.id === socket.id).cards.sort((a, b) => parseInt(a.year) - parseInt(b.year)).map((c, index) => (
                                    <Grid key={index} sx={{display: 'flex', flexDirection: "row", m: 'auto'}}>
                                        {index === 0 && (
                                            <Button disabled={lobby.players[lobby.currentTurn].id !== socket.id || !isAllowedToGuess}
                                                    onClick={() => beforeAction(index, socket.id)}>
                                                <Container>
                                                    <SelectSvg/>
                                                </Container>

                                            </Button>
                                        )}
                                        <CardOnBoard card={c}/>
                                        <Button disabled={lobby.players[lobby.currentTurn].id !== socket.id || !isAllowedToGuess}
                                                onClick={() => afterAction(index, socket.id)}>
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
                                <Typography
                                    sx={{m: 'auto'}}>{lobby.players.find(p => p.id == socket.id) && lobby.players.find(p => p.id == socket.id).nickname}</Typography>
                                <Typography
                                    sx={{m: 'auto'}}>Score: {lobby.players.find(p => p.id == socket.id) && lobby.players.find(p => p.id == socket.id).score}</Typography>


                            </Box>

                        </Box>
                    </Box>


{/*                    <Modal open={progress < 100}>
                        <Box sx={{
                            position: 'absolute' as 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}>
                            <CircularStatic progress={progress}/>
                        </Box>

                    </Modal>*/}
                </div>

            )}

        </Container>
    )
}

export default LobbyPage;


const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/*

  {
    "id": "234",
    "gameName": "Uno",
    "players": [
      {
        "id": "123",
        "nickname": "KlasseBrasse",
        "score": 0,
        "cards": [

        ]
      },
      {
        "id": "234",
        "nickname": "Jöjje",
        "score": 0,
        "cards": [

        ]
      },
      {
        "id": "345",
        "nickname": "Jöns",
        "score": 0,
        "cards": [

        ]
      },
      {
        "id": "999",
        "nickname": "MainPlayer",
        "score": 0,
        "cards": [

        ]
      }
    ],
    "currentTurn": 0,
    "cardDecks": [],
    "currentCard": {},
    "currentHistoryCardDeckIndex": 0,
    "currentSportsCardDeckIndex": 0,
    "currentTechCardDeckIndex": 0,
    "currentCountryCardDeckIndex": 0,
    "currentCat": ""

  }

 */