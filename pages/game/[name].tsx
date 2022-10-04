import Head from "next/head";
import {IGame} from "../../types/IGame";
import gamesdata from "../../data/games.json"

function GamePage({game}: {game: IGame}) {
    return(
        <div>
            <Head>
                <title>{game.name}</title>
            </Head>
            <h1>{game.name}</h1>
        </div>
    )
}

export async function getStaticPaths(game: any) {
    let paths = gamesdata.map((game: { name: string; }) => {
        return {
            params: {
                name: game.name.toLowerCase().split(" ").join("-")
            }
        }
    });

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({params}: {params: { name: string}}) {
    const game = gamesdata.find(c => c.name.toLowerCase() == params.name.toLowerCase());
    return {
        props: {
            game
        }
    }
}

export default GamePage;


