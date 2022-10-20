import {IPlayer} from "../../types/IPlayer";
import {Box, List, ListItem, Typography} from "@mui/material";

function OtherPlayerCard({player}: {player: IPlayer}) {
    return(
        <Box sx={{ border: 1, borderRadius: 3, borderWidth:2, backgroundColor: "#264653", width: "30vw", pt: 10}}>

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                p: 1,
                m: 1,

            }}>
                <Typography sx={{m: 'auto'}}>{player.nickname}</Typography>
                <Typography sx={{m: 'auto'}}>Score: {player.score}</Typography>
            </Box>

        </Box>
    )

}

export default OtherPlayerCard;