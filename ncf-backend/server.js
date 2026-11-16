require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());
app.use(cors());

// --- Unified Donation Route ---
app.post('/api/donate', async (req, res) => {
    const { provider, amount, phone, description } = req.body;

    if (!provider) {
        return res.status(400).json({ success: false, error: "Payment provider (mtn or airtel) is required." });
    }

    if (provider.toLowerCase() === 'mtn') {
        return handleMtnDonation(req, res, amount, phone, description);
    } else if (provider.toLowerCase() === 'airtel') {
        return handleAirtelDonation(req, res, amount, phone, description);
    } else {
        return res.status(400).json({ success: false, error: "Invalid payment provider. Use 'mtn' or 'airtel'." });
    }
});

// --- 1. MTN MOMO COLLECTION HANDLER ---
async function handleMtnDonation(req, res, amount, phone, description) {
    try {
        const referenceId = uuidv4();
        const env = process.env.MTN_ENVIRONMENT || 'sandbox';
        const baseUrl = env === 'production' 
            ? 'https://momo.mtn.com' 
            : 'https://sandbox.momodeveloper.mtn.com';

        // 1. Get Access Token
        const auth = Buffer.from(`${process.env.MTN_API_USER}:${process.env.MTN_API_KEY}`).toString('base64');
        const tokenRes = await axios.post(`${baseUrl}/collection/token/`, {}, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY
            }
        });
        const accessToken = tokenRes.data.access_token;

        // 2. Request To Pay (Triggers USSD Prompt)
        await axios.post(`${baseUrl}/collection/v1_0/requesttopay`, {
            amount: amount.toString(),
            currency: env === 'production' ? "UGX" : "EUR", // Sandbox typically requires EUR unless configured otherwise
            externalId: referenceId,
            payer: {
                partyIdType: "MSISDN",
                partyId: phone // Format: 256771234567
            },
            payerMessage: description || "NCF Donation",
            payeeNote: "Native Charitable Foundation"
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Reference-Id': referenceId,
                'X-Target-Environment': env,
                'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
                'Content-Type': 'application/json'
            }
        });

        return res.json({ success: true, referenceId, message: "MTN USSD prompt sent to your phone!" });
    } catch (error) {
        console.error("MTN Error:", error.response?.data || error.message);
        return res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
}

// --- 2. AIRTEL MONEY COLLECTION HANDLER ---
async function handleAirtelDonation(req, res, amount, phone, description) {
    try {
        const referenceId = uuidv4();
        const baseUrl = 'https://openapi.airtel.africa';

        // 1. Get OAuth Token
        const tokenRes = await axios.post(`${baseUrl}/auth/oauth2/token`, {
            client_id: process.env.AIRTEL_CLIENT_ID,
            client_secret: process.env.AIRTEL_CLIENT_SECRET,
            grant_type: "client_credentials"
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        const accessToken = tokenRes.data.access_token;

        // 2. Merchant Payment Push
        await axios.post(`${baseUrl}/merchant/v1/payments/`, {
            reference: referenceId,
            subscriber: {
                country: process.env.AIRTEL_COUNTRY || "UG",
                currency: process.env.AIRTEL_CURRENCY || "UGX",
                msisdn: phone // Format: 256701234567
            },
            transaction: {
                amount: amount.toString(),
                country: process.env.AIRTEL_COUNTRY || "UG",
                currency: process.env.AIRTEL_CURRENCY || "UGX",
                id: referenceId
            }
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Country': process.env.AIRTEL_COUNTRY || "UG",
                'X-Currency': process.env.AIRTEL_CURRENCY || "UGX",
                'Content-Type': 'application/json'
            }
        });

        return res.json({ success: true, referenceId, message: "Airtel USSD prompt sent to your phone!" });
    } catch (error) {
        console.error("Airtel Error:", error.response?.data || error.message);
        return res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
}

// Local testing fallback if running node server.js directly
if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Local NCF Payment Server running on port ${PORT}`));
}

// Export for Netlify Functions
module.exports = app;
module.exports.handler = serverless(app);