import {ICard} from "../../types/ICard";
import {Card} from "@mui/material";


function CardOnBoard({card}: {card: ICard}) {
    return(

            <Card sx={{height: 60, width: 40, m: 'auto', backgroundColor: "green", display:'flex', justifyContent:'center'}}>
                <h5>{card.year}</h5>
            </Card>

    )
}

export default CardOnBoard;