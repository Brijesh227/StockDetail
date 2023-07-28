// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW

require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.enable('trust proxy');

app.post('/api/fetchStockData', async (req, res) => {
    const { symbol, date } = req.body;
    if(symbol && date) {
        const apikey = process.env.APIKEY;
        await axios.get(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${date}/${date}?adjusted=true&apiKey=${apikey}`)
            .then((response) => {
                const stockDetail = {
                    Open: response?.data?.results?.[0]?.o,
                    Close: response?.data?.results?.[0]?.c,
                    High: response?.data?.results?.[0]?.h,
                    Low: response?.data?.results?.[0]?.l,
                    Volume: response?.data?.results?.[0]?.v
                }
                return res.status(200).json({ stockDetail });
            })
            .catch((error) => {
                console.log("error",error.response.data);
                return res.status(500).json({ error: error.response.data });
            })
    } else {
        return res.status(400).json({ error: "required field is not provided." });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));