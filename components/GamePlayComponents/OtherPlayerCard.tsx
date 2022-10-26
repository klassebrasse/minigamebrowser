import {Box, Button, Typography} from "@mui/material";
import CardOnBoard from "./CardOnBoard";
import {PassingPropsPlayerCards} from "../../types/PassingPropsPlayerCards";

function OtherPlayerCard({player, beforeButton, afterButton, isPlayersTurn} : PassingPropsPlayerCards) {

    return(
        <Box sx={{ border: 1, borderRadius: 3, borderWidth:2, backgroundColor: "#264653", width: "30vw"}}>

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                p: 1,
                m: 1,
                backgroundColor: "lightBlue"

            }}>
                {player.cards.sort((a,b) => parseInt(a.year) - parseInt(b.year)).map((c, index) => (

                    <CardOnBoard key={index} card={c}/>


                ))}
            </Box>
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