import axios from "axios";

const getSymbolList = async () => {
    const symbolList = [];
    const response = await axios.get(`https://api.polygon.io/v3/reference/tickers?market=stocks&active=true&apiKey=Ne662MI60pig3VJLqr6BoCMELEpRVcrL`);
    const resultArray = response?.data?.results;
    resultArray.forEach(element => {
        symbolList.push(element.ticker);
    });
    return symbolList;
}

const getStockDetail = async (symbol,date) => {
    const stock = await axios.post(`http://localhost:5000/api/fetchStockData`, {
        symbol,
        date
    });
    return stock;
}

export { getSymbolList, getStockDetail };