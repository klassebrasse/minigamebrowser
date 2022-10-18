import {IPlayer} from "../types/IPlayer";
import {Box, Container, List, ListItem} from "@mui/material";

function PlayerList({players} : {players: IPlayer[]}) {
    return(
        <Box sx={{ border: 1, borderRadius: 3, borderWidth:2, backgroundColor: "#264653", m:"auto", width: "60vw" }} >
            <List>
            {players.map(player => (
                <ListItem key={player.id} >
                    <Box sx={{flexGrow: 1, display: "flex", flexDirection: "row", borderBottom: 1, alignItems: "flex-end"}}>
                        <h2>{player.id}</h2>
                        <h2>{player.nickname}</h2>
                        <h2>{player.score}</h2>
                        <h2>{player.score}</h2>
                    </Box>

                </ListItem>
            ))}
            </List>
        </Box>

    )
}
export default PlayerList;