export async function retrieveCovidData() {
    const data = await fetch('./coviddata.json');
    return data.json()
}