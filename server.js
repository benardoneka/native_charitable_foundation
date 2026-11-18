// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const donationRoutes = require('./routes/donations');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Serve static frontend files if needed
app.use(express.static(__dirname));

// Mount donation API routes under /api
app.use('/api', donationRoutes);

// Local server listener for testing
if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
    app.listen(PORT, () => console.log(`NCF Payment Server running on port ${PORT}`));
}

// Export for Netlify Serverless Functions
module.exports = app;
module.exports.handler = serverless(app);




























// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const { v4: uuidv4 } = require('uuid');
// const serverless = require('serverless-http'); // [ADDED for Netlify serverless support]

// const app = express();
// app.use(express.json());
// app.use(cors());

// const PORT = process.env.PORT || 3000;

// app.use(express.static(__dirname));


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + 'Native Charity Foundation Home');
// });

// // --- UNIFIED DONATION ROUTE (Optional convenience router) ---
// app.post('/api/donate', async (req, res) => {
//     const { provider, amount, phone, description } = req.body;

//     if (!provider) {
//         return res.status(400).json({ success: false, error: "Payment provider is required." });
//     }

//     const prov = provider.toLowerCase();
//     if (prov === 'mtn') {
//         return handleMtnDonation(req, res, amount, phone, description);
//     } else if (prov === 'airtel') {
//         return handleAirtelDonation(req, res, amount, phone, description);
//     } else if (prov === 'pawapay') { // [ADDED for PawaPay routing]
//         return handlePawaPayDonation(req, res, amount, phone, description);
//     } else {
//         return res.status(400).json({ success: false, error: "Invalid payment provider." });
//     }
// });

// // --- 1. MTN MOMO COLLECTION API (ORIGINAL - UNTOUCHED) ---
// app.post('/api/donate/mtn', async (req, res) => {
//     try {
//         const { amount, phone, description } = req.body;
//         const referenceId = uuidv4();
//         const env = process.env.MTN_ENVIRONMENT || 'sandbox';
//         const baseUrl = env === 'production' 
//             ? 'https://momo.mtn.com' 
//             : 'https://sandbox.momodeveloper.mtn.com';

//         // 1. Get Access Token
//         const auth = Buffer.from(`${process.env.MTN_API_USER}:${process.env.MTN_API_KEY}`).toString('base64');
//         const tokenRes = await axios.post(`${baseUrl}/collection/token/`, {}, {
//             headers: {
//                 'Authorization': `Basic ${auth}`,
//                 'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY
//             }
//         });
//         const accessToken = tokenRes.data.access_token;

//         // 2. Request To Pay (Triggers USSD Prompt)
//         await axios.post(`${baseUrl}/collection/v1_0/requesttopay`, {
//             amount: amount.toString(),
//             currency: env === 'production' ? "UGX" : "EUR",
//             externalId: referenceId,
//             payer: {
//                 partyIdType: "MSISDN",
//                 partyId: phone
//             },
//             payerMessage: description || "NCF Donation",
//             payeeNote: "Native Charitable Foundation"
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'X-Reference-Id': referenceId,
//                 'X-Target-Environment': env,
//                 'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
//                 'Content-Type': 'application/json'
//             }
//         });

//         res.json({ success: true, referenceId, message: "MTN USSD prompt sent to your phone!" });
//     } catch (error) {
//         console.error("MTN Error:", error.response?.data || error.message);
//         res.status(500).json({ success: false, error: error.response?.data || error.message });
//     }
// });

// // --- 2. AIRTEL MONEY COLLECTION API (ORIGINAL - UNTOUCHED) ---
// app.post('/api/donate/airtel', async (req, res) => {
//     try {
//         const { amount, phone, description } = req.body;
//         const referenceId = uuidv4();
//         const baseUrl = 'https://openapi.airtel.africa';

//         // 1. Get OAuth Token
//         const tokenRes = await axios.post(`${baseUrl}/auth/oauth2/token`, {
//             client_id: process.env.AIRTEL_CLIENT_ID,
//             client_secret: process.env.AIRTEL_CLIENT_SECRET,
//             grant_type: "client_credentials"
//         }, {
//             headers: { 'Content-Type': 'application/json' }
//         });
//         const accessToken = tokenRes.data.access_token;

//         // 2. Merchant Payment Push
//         await axios.post(`${baseUrl}/merchant/v1/payments/`, {
//             reference: referenceId,
//             subscriber: {
//                 country: process.env.AIRTEL_COUNTRY || "UG",
//                 currency: process.env.AIRTEL_CURRENCY || "UGX",
//                 msisdn: phone
//             },
//             transaction: {
//                 amount: amount.toString(),
//                 country: process.env.AIRTEL_COUNTRY || "UG",
//                 currency: process.env.AIRTEL_CURRENCY || "UGX",
//                 id: referenceId
//             }
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'X-Country': process.env.AIRTEL_COUNTRY || "UG",
//                 'X-Currency': process.env.AIRTEL_CURRENCY || "UGX",
//                 'Content-Type': 'application/json'
//             }
//         });

//         res.json({ success: true, referenceId, message: "Airtel USSD prompt sent to your phone!" });
//     } catch (error) {
//         console.error("Airtel Error:", error.response?.data || error.message);
//         res.status(500).json({ success: false, error: error.response?.data || error.message });
//     }
// });


// // --- 3. PAWAPAY COLLECTION API [ADDED NEW] ---
// app.post('/api/donate/pawapay', async (req, res) => {
//     return handlePawaPayDonation(req, res, req.body.amount, req.body.phone, req.body.description);
// });

// // async function handlePawaPayDonation(req, res, amount, phone, description) {
// //     try {
// //         const depositId = uuidv4();
// //         const env = process.env.PAWAPAY_ENVIRONMENT || 'sandbox';
// //         // PawaPay base URL based on environment
// //         const baseUrl = env === 'production' 
// //             ? 'https://api.pawapay.io' 
// //             : 'https://api.sandbox.pawapay.io';

// //         // Determine correspondent based on phone prefix or request body (defaulting to Uganda MTN/Airtel correspondent format)
// //         const correspondent = req.body.correspondent || "MTN_MOMO_UGA"; 

// //         await axios.post(`${baseUrl}/deposits`, {
// //             depositId: depositId,
// //             amount: amount.toString(),
// //             currency: process.env.PAWAPAY_CURRENCY || "UGX",
// //             correspondent: correspondent,
// //             payer: {
// //                 type: "MSISDN",
// //                 address: {
// //                     value: phone // Format: 256771234567 without '+'
// //                 }
// //             },
// //             statementDescription: description || "NCF Donation"
// //         }, {
// //             headers: {
// //                 'Authorization': `Bearer ${process.env.PAWAPAY_API_TOKEN}`, //
// //                 'Content-Type': 'application/json'
// //             }
// //         });

// //         return res.json({ success: true, depositId, message: "PawaPay deposit request initiated!" });
// //     } catch (error) {
// //         console.error("PawaPay Error:", error.response?.data || error.message);
// //         return res.status(500).json({ success: false, error: error.response?.data || error.message });
// //     }
// // }



// async function handlePawaPayDonation(req, res, amount, phone, description) {
//     try {
//         const depositId = uuidv4();
//         const env = process.env.PAWAPAY_ENVIRONMENT || 'sandbox';
//         const baseUrl = env === 'production' 
//             ? 'https://api.pawapay.io' 
//             : 'https://api.sandbox.pawapay.io';

//         const correspondent = req.body.correspondent || "MTN_MOMO_UGA"; 

//         // [ADDED] Generate required ISO timestamp for PawaPay
//         const customerTimestamp = new Date().toISOString();

//         await axios.post(`${baseUrl}/deposits`, {
//             depositId: depositId,
//             amount: amount.toString(),
//             currency: process.env.PAWAPAY_CURRENCY || "UGX",
//             correspondent: correspondent,
//             payer: {
//                 type: "MSISDN",
//                 address: {
//                     value: phone 
//                 }
//             },
//             customerTimestamp: customerTimestamp, // [ADDED required property]
//             statementDescription: description || "NCF Donation"
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.PAWAPAY_API_TOKEN}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         return res.json({ success: true, depositId, message: "PawaPay deposit request initiated!" });
//     } catch (error) {
//         console.error("PawaPay Error:", error.response?.data || error.message);
//         return res.status(500).json({ success: false, error: error.response?.data || error.message });
//     }
// }


// // --- 4. PAWAPAY WEBHOOK CALLBACK ENDPOINT [ADDED NEW] ---
// // PawaPay posts asynchronous transaction status updates here
// app.post('/api/pawapay/callback', express.json(), async (req, res) => {
//     try {
//         const callbackData = req.body;
        
//         // Always respond with 200 OK immediately as required by webhook best practices
//         res.status(200).send({ received: true });

//         const { depositId, status, amount, currency, statementDescription } = callbackData;
//         console.log(`PawaPay Callback -> Deposit: ${depositId}, Status: ${status}, Amount: ${amount} ${currency}`);

//         if (status === 'COMPLETED') {
//             // TODO: Record successful donation in your database
//         } else if (status === 'FAILED') {
//             // TODO: Handle failed transaction
//         }
//     } catch (err) {
//         console.error("PawaPay Callback Error:", err);
//     }
// });


// // Local server fallback for testing (ORIGINAL - UNTOUCHED)
// if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
//     app.listen(PORT, () => console.log(`NCF Payment Server running on port ${PORT}`));
// }

// // Export for Netlify Serverless Functions (ORIGINAL - UNTOUCHED)
// module.exports = app;
// module.exports.handler = serverless(app);



// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const { v4: uuidv4 } = require('uuid');
// const serverless = require('serverless-http');

// const app = express();
// app.use(express.json());
// app.use(cors());

// // --- Unified Donation Route ---
// app.post('/api/donate', async (req, res) => {
//     const { provider, amount, phone, description } = req.body;

//     if (!provider) {
//         return res.status(400).json({ success: false, error: "Payment provider (mtn or airtel) is required." });
//     }

//     if (provider.toLowerCase() === 'mtn') {
//         return handleMtnDonation(req, res, amount, phone, description);
//     } else if (provider.toLowerCase() === 'airtel') {
//         return handleAirtelDonation(req, res, amount, phone, description);
//     } else {
//         return res.status(400).json({ success: false, error: "Invalid payment provider. Use 'mtn' or 'airtel'." });
//     }
// });

// // --- 1. MTN MOMO COLLECTION HANDLER ---
// async function handleMtnDonation(req, res, amount, phone, description) {
//     try {
//         const referenceId = uuidv4();
//         const env = process.env.MTN_ENVIRONMENT || 'sandbox';
//         const baseUrl = env === 'production' 
//             ? 'https://momo.mtn.com' 
//             : 'https://sandbox.momodeveloper.mtn.com';

//         // 1. Get Access Token
//         const auth = Buffer.from(`${process.env.MTN_API_USER}:${process.env.MTN_API_KEY}`).toString('base64');
//         const tokenRes = await axios.post(`${baseUrl}/collection/token/`, {}, {
//             headers: {
//                 'Authorization': `Basic ${auth}`,
//                 'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY
//             }
//         });
//         const accessToken = tokenRes.data.access_token;

//         // 2. Request To Pay (Triggers USSD Prompt)
//         await axios.post(`${baseUrl}/collection/v1_0/requesttopay`, {
//             amount: amount.toString(),
//             currency: env === 'production' ? "UGX" : "EUR", // Sandbox typically requires EUR unless configured otherwise
//             externalId: referenceId,
//             payer: {
//                 partyIdType: "MSISDN",
//                 partyId: phone // Format: 256771234567
//             },
//             payerMessage: description || "NCF Donation",
//             payeeNote: "Native Charitable Foundation"
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'X-Reference-Id': referenceId,
//                 'X-Target-Environment': env,
//                 'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
//                 'Content-Type': 'application/json'
//             }
//         });

//         return res.json({ success: true, referenceId, message: "MTN USSD prompt sent to your phone!" });
//     } catch (error) {
//         console.error("MTN Error:", error.response?.data || error.message);
//         return res.status(500).json({ success: false, error: error.response?.data || error.message });
//     }
// }

// // --- 2. AIRTEL MONEY COLLECTION HANDLER ---
// async function handleAirtelDonation(req, res, amount, phone, description) {
//     try {
//         const referenceId = uuidv4();
//         const baseUrl = 'https://openapi.airtel.africa';

//         // 1. Get OAuth Token
//         const tokenRes = await axios.post(`${baseUrl}/auth/oauth2/token`, {
//             client_id: process.env.AIRTEL_CLIENT_ID,
//             client_secret: process.env.AIRTEL_CLIENT_SECRET,
//             grant_type: "client_credentials"
//         }, {
//             headers: { 'Content-Type': 'application/json' }
//         });
//         const accessToken = tokenRes.data.access_token;

//         // 2. Merchant Payment Push
//         await axios.post(`${baseUrl}/merchant/v1/payments/`, {
//             reference: referenceId,
//             subscriber: {
//                 country: process.env.AIRTEL_COUNTRY || "UG",
//                 currency: process.env.AIRTEL_CURRENCY || "UGX",
//                 msisdn: phone // Format: 256701234567
//             },
//             transaction: {
//                 amount: amount.toString(),
//                 country: process.env.AIRTEL_COUNTRY || "UG",
//                 currency: process.env.AIRTEL_CURRENCY || "UGX",
//                 id: referenceId
//             }
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'X-Country': process.env.AIRTEL_COUNTRY || "UG",
//                 'X-Currency': process.env.AIRTEL_CURRENCY || "UGX",
//                 'Content-Type': 'application/json'
//             }
//         });

//         return res.json({ success: true, referenceId, message: "Airtel USSD prompt sent to your phone!" });
//     } catch (error) {
//         console.error("Airtel Error:", error.response?.data || error.message);
//         return res.status(500).json({ success: false, error: error.response?.data || error.message });
//     }
// }

// // Local testing fallback if running node server.js directly
// if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => console.log(`Local NCF Payment Server running on port ${PORT}`));
// }

// // Export for Netlify Functions
// module.exports = app;
// module.exports.handler = serverless(app);