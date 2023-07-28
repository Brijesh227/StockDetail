import React, { useState, useEffect, useRef } from "react";
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getSymbolList, getStockDetail } from "./api/symbol";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
	const initialStoclDetail = {
		Open: undefined,
		High: undefined,
		Low: undefined,
		Close: undefined,
		Volume: undefined
	};

	const [symbol, setSymbol] = useState("");
	const [symbolList, setSymbolList] = useState([]);
	const [date, setDate] = useState(dayjs(new Date()));
	const [stockDetail, setStockDetail] = useState(initialStoclDetail);

	const dataFetchedRef = useRef(false);

	useEffect(() => {
		if (dataFetchedRef.current) return;
		dataFetchedRef.current = true;
		async function fetchStockData() {
			try {
				const data = await getSymbolList();
				setSymbolList(data);
			} catch (error) {
				console.log("error while fetch stock list", error);
			}
		}
		fetchStockData();
		return () => {
			setSymbol("");
		}
	}, []);

	const constructDatObject = (date) => {
		const day = date.$D < 10 ? `0${date.$D}` : `${date.$D}`;
		const month = date.$M < 10 ? `0${date.$M + 1}` : `${date.$M + 1}`;
		return `${date.$y}-${month}-${day}`;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (date && symbol) {
			const dateObject = constructDatObject(date);
			try {
				const stockData = await getStockDetail(symbol, dateObject);
				setStockDetail(stockData?.data?.stockDetail);
			} catch (error) {
				setStockDetail(initialStoclDetail);
				console.log("error while submit data", error);
			}
		} else {
			console.error(new Error("please provide required fields."));
		}
	}

	return (
		<Container>
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{ alignItems: "center", marginTop: 10, marginBottom: 10 }}
			>
				<Grid
					container
					direction="column"
					justifyContent="center"
					alignItems="center"
					spacing={2}
				>
					<Grid>
						<h4>Stock Detail</h4>
					</Grid>
					<Grid item md={12}>
						<Autocomplete
							disablePortal
							id="combo-box-demo"
							onChange={(event, value) => setSymbol(value)}
							options={symbolList}
							sx={{ width: 275 }}
							renderInput={(params) => <TextField {...params} label="Select stock symbol" />}
						/>
					</Grid>
					<Grid item md={12}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								label="Select Date"
								value={date}
								onChange={(newValue) => setDate(newValue)}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item md={4}>
						<Button type="submit" color="primary" variant="contained">submit</Button>
					</Grid>
				</Grid>
			</Box>
			{
				stockDetail.Open && <Grid
				container
				direction="column"
				justifyContent="center"
				alignItems="center"
				spacing={2}
			>
				<Grid>
					<span>Open:</span> {stockDetail.Open}
				</Grid>
				<Grid>
					<span>High:</span> {stockDetail.High}
				</Grid>
				<Grid>
					<span>Low:</span> {stockDetail.Low}
				</Grid>
				<Grid>
					<span>Close:</span> {stockDetail.Close}
				</Grid>
				<Grid>
					<span>Volume:</span> {stockDetail.Volume}
				</Grid>
			</Grid>
			}
		</Container>
	);
}

export default App;