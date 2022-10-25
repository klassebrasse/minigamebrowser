import {Box, Button, Typography} from "@mui/material";
import CardOnBoard from "./CardOnBoard";
import {PassingPropsPlayerCards} from "../../types/PassingPropsPlayerCards";

function OtherPlayerCard({player, beforeButton, afterButton} : PassingPropsPlayerCards) {

    return(
        <Box sx={{ border: 1, borderRadius: 3, borderWidth:2, backgroundColor: "#264653", width: "30vw"}}>

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                p: 1,
                m: 1,
                backgroundColor: "lightBlue"

            }}>
                {player.cards.map((c, index) => (
                    <Box key={index} sx={{display: 'flex', flexDirection: "row", m: 'auto'}}>
                        <Button onClick={() => beforeButton(index)}>
                            <h5>Before {c.year}</h5>
                        </Button>
                    <CardOnBoard card={c}/>
                        <Button onClick={() => afterButton(index)}>
                            <h5>After {c.year}</h5>
                        </Button>
                    </Box>

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