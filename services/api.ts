
async function getHistorical(cat: string) {
    const meta = {
        'X-Api-Key': 'YuAhR6x2/fckgC8JWJOcBA==K7gB4sAqTFD250vK'
    };
    const headers = new Headers(meta);

    const response = await fetch('https://api.api-ninjas.com/v1/historicalevents?text=' + cat, {headers});
    const data = await response.json();
    return data;
}

export default getHistorical;