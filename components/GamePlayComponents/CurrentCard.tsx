import {ICard} from "../../types/ICard";
import {Card, CardContent, Typography} from "@mui/material";

function CurrentCard({card}: {card: ICard}) {
    return(
        <Card sx={{width: 220, height: 330, m: "auto", backgroundColor: "#8250ff"}}>
            {card && (
                <CardContent>
                    <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>
                        {card.event}
                    </Typography>
                </CardContent>
            )}
        </Card>
    )

}

export default CurrentCard;