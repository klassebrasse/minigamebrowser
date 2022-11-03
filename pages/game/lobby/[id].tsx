import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {ILobby} from "../../../types/ILobby";
import {Box, Button, Container, Modal, Typography} from "@mui/material";
import {InferGetServerSidePropsType} from "next";
import MainCardDeck from "../../../components/GamePlayComponents/MainCardDeck";
import {IPlayer} from "../../../types/IPlayer";
import OtherPlayerCard from "../../../components/GamePlayComponents/OtherPlayerCard";
import CurrentCard from "../../../components/GamePlayComponents/CurrentCard";
import CircularStatic from "../../../components/ProgresSpinner";
import CardOnBoard from "../../../components/GamePlayComponents/CardOnBoard";
import {FaDice} from "react-icons/fa";
import Grid from "@mui/system/Unstable_Grid";
import SelectSvg from "../../../public/SelectSvg";
import {SocketContext} from "../../../contexts/socketContext";


function LobbyPage({data}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const socket = useContext(SocketContext);

    const [mainPlayerData, setMainPlayerData] = useState<IPlayer>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [progress, setProgress] = useState(0);

    const [lobby, setLobby] = useState<ILobby>(null);


    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    function getDataFromServer(lid): Promise<ILobby> {
        return new Promise(resolve => socket.emit('join room and get lobby data', lid, callback => resolve(callback.lobby)));
    }

    useEffect(() => {
        (async () => {
            //Todo: Callback see if user is allowed
            setLobby(await getDataFromServer(data))
        })()


        socket.on('random card', (newLobby) => {
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
        })

        socket.on('turn changed', (newLobby) => {
            setLobby(prevState => {
                let temp = {
                    ...prevState,
                    lobby: {...prevState}
                }
                temp.players = newLobby.players;
                temp.currentTurn = newLobby.currentTurn;

                return temp;
            })
        })

        socket.on('guess checked', (newLobby, guessIs) => {
            console.log('guess checked')
            console.log(newLobby.players)
            if (guessIs)
                alert(true)
            else
                alert(false)


            setLobby(prevState => {
                let temp = {
                    ...prevState,
                    lobby: {...prevState}
                }
                temp.players = newLobby.players;

                return temp;
            })
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
        socket.emit('random card', '234');
    }

    function beforeAction(index: number, pid: string) {
        console.log('sending guess' + pid)
        socket.emit('guess before', '234', index, pid);
    }

    function afterAction(index: number, pid: string) {
        console.log('sending guess')
        socket.emit('guess after', '234', index, pid)
    }

    const mySocketId = "999";
    const [indexTurn, setIndexTurn] = useState(3);

    function changeTurn() {
        //Todo: Ide att skicka socket.id för att players.findIndex på serverside
        socket.emit('change turn', '234')
    }

    function removeUnsafeCards(playerIndex: number) {
        setLobby(prevState => {
            let temp = {
                ...prevState,
                players: [...prevState.players]
            }
            temp.players[playerIndex].cards = temp.players[playerIndex].cards.filter(c => c.isSafe === true)

            return temp;
        })
    }

    function maxWitdh() {
        let x = lobby.players.find(p => p.id === "999").cards.length;
        return `${100 / (x + 1)}vw`
    }

    return (
        <Container sx={{maxWidth: '100vw', minWidth: '100vw'}}>
            {!lobby ? (
                <h1>loading</h1>
            ) : (
                <div>
                    <Button variant={"outlined"} onClick={() => changeTurn()}>
                        <Typography>
                            End turn
                        </Typography>
                    </Button>
                    <Button onClick={() => randomCard()}>
                        <FaDice size={42}/>
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
                        maxWidth: '60vw',
                    }}>
                        <MainCardDeck color="#528D70" category="History" cardClicked={() => cardChosen('history')}/>
                        <MainCardDeck color="#658FC9" category="Sports" cardClicked={() => cardChosen('sports')}/>
                        <MainCardDeck color="#F77EEC" category="Country" cardClicked={() => cardChosen('country')}/>
                        <MainCardDeck color="#FC8F3A" category="Tech" cardClicked={() => cardChosen('tech')}/>
                    </Container>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        p: 1,


                    }}>
                        {lobby.players.filter(p => p.id !== "999").map(p => (
                            <OtherPlayerCard key={p.id} player={p}
                                             beforeButton={(index, pid) => beforeAction(index, pid)}
                                             afterButton={(index, pid) => afterAction(index, pid)}
                                             isPlayersTurn={lobby.players[lobby.currentTurn].id === mySocketId}/>
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

                                {lobby.players.find(p => p.id === "999").cards.sort((a, b) => parseInt(a.year) - parseInt(b.year)).map((c, index) => (
                                    <Grid key={index} sx={{display: 'flex', flexDirection: "row", m: 'auto'}}>
                                        {index === 0 && (
                                            <Button disabled={lobby.players[lobby.currentTurn].id !== mySocketId}
                                                    onClick={() => beforeAction(index, "999")}>
                                                <Container>
                                                    <SelectSvg/>
                                                </Container>

                                            </Button>
                                        )}
                                        <CardOnBoard card={c}/>
                                        <Button disabled={lobby.players[lobby.currentTurn].id !== mySocketId}
                                                onClick={() => afterAction(index, "999")}>
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
                                    sx={{m: 'auto'}}>{lobby.players.find(p => p.id == "999") && lobby.players.find(p => p.id == "999").nickname}</Typography>
                                <Typography
                                    sx={{m: 'auto'}}>Score: {lobby.players.find(p => p.id == "999") && lobby.players.find(p => p.id == "999").score}</Typography>


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

export async function getServerSideProps(context) {
    //let data: ILobby;

    /*
        const data = await getDataFromServer(context.query.id)

        if(!data){
            return {
                notFound: true
            }
        }
    */
    const data = context.query.id;

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));