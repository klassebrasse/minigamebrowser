
async function getHistorical() {
    const meta = {
        'X-Api-Key': 'YuAhR6x2/fckgC8JWJOcBA==K7gB4sAqTFD250vK'
    };
    const headers = new Headers(meta);

    const response = await fetch('https://api.api-ninjas.com/v1/historicalevents?text=sweden', {headers});
    const data = await response.json();
    console.log(data)
    return data;
}

export default getHistorical;