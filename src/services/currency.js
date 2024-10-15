import fetch from 'node-fetch'
export const currency = async () => {
    try {
        const coin = await fetch(` https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/USD`)
        console.log(await coin.json())
        return coin
    } catch (error) {
        console.log(error)
    }
}