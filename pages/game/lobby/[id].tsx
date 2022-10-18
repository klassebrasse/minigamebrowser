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
import {IHistory} from "../../../types/IHistory";


function LobbyPage({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {


    const [players, setPlayers] = useState<ILobby[]>([]);
    const [lobby, setLobby] = useState<ILobby>();
    const [history, setHistory] = useState<IHistory[]>(null);
    const [currentCard, setCurrentCard] = useState(0);

    useEffect(() => {

        (async () => {
            setHistory(await getHistorical());
            console.log(history)
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

    async function getHis(){
        setHistory(await getHistorical());
    }

    return(
        <Container>

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                p: 1,
                m: 1,

            }}>
                <Card sx={{width: 240, height: 360, m: "auto"}} onClick={() => setCurrentCard(currentCard + 1)}>
                    <CardContent>
                        {history &&
                            <Typography sx={{ fontSize: 14 }}>
                                {history[currentCard].event}
                            </Typography>
                        }

                    </CardContent>
                </Card>
            </Box>

            <PlayerList players={players}/>
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


