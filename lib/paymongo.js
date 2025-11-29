// lib/paymongo.js
import axios from "axios";

export const paymongo = axios.create({
	baseURL: "https://api.paymongo.com/v1",
	headers: {
		Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY).toString("base64")}`,
		"Content-Type": "application/json",
	},
});