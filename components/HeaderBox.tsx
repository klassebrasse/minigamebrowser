import {Box} from "@mui/material";

function HeaderBox({Header, SubHeader}) {
    return(
        <Box m="auto"
             display="flex"
             width="60vw" height="40vh"


        >
            <Box m="auto" style={{textAlign: "center", color: "darkslategrey"}}>
                <h1>{Header}</h1>
                <h1>{SubHeader}</h1>
            </Box>
        </Box>
    )
}

export default HeaderBox;