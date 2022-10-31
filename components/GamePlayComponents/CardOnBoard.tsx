import {ICard} from "../../types/ICard";
import {Card} from "@mui/material";
import {FaLock, FaLockOpen} from "react-icons/fa";


function CardOnBoard({card}: {card: ICard}) {
    return(

            <Card sx={{height: 60, width: 40, minWidth: 40, m: 'auto', backgroundColor: card.color, display:'flex', justifyContent:'center'}}>
                {card.isSafe ? (
                    <FaLock style={{position: "absolute"}}/>
                ) : (
                    <FaLockOpen style={{position: "absolute"}}/>
                )}
                <h5>{card.year}</h5>
            </Card>

    )
}

export default CardOnBoard;