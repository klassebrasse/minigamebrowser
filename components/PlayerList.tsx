import {IPlayer} from "../types/IPlayer";
import {Box, Container, List, ListItem} from "@mui/material";

function PlayerList({players} : {players: IPlayer[]}) {
    return(
        <Box sx={{ border: 1, borderRadius: 3, borderWidth:2, backgroundColor: "#264653", m:"auto", width: "60vw" }} >
            <List>
            {players.map(player => (
                <ListItem key={player.id} >
                    <h1>{player.id}</h1>
                    <h1>{player.nickname}</h1>
                    <h1>{player.score}</h1>
                </ListItem>
            ))}
            </List>
        </Box>

    )
}
export default PlayerList;