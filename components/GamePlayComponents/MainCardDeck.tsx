import {Card, CardContent, Typography} from "@mui/material";

function MainCardDeck({cardClicked, category}) {
    return(
        <Card sx={{width: 160, height: 240, m: "auto", backgroundColor: "#8250ff"}} onClick={() => cardClicked()}>

        </Card>
    )
}

export default MainCardDeck;