import {Card, CardContent, CardHeader, Typography} from "@mui/material";

function MainCardDeck({cardClicked, category, color}) {
    return(
        <Card aria-disabled={true} sx={{width: 160, height: 60, m: "auto", backgroundColor: color, textAlign: 'center', ":hover":{cursor: "pointer", backgroundColor: "#2a9d8f"}}} onClick={() => cardClicked()}>
            <CardContent>
                <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>
                    {category}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default MainCardDeck;