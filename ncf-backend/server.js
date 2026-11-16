require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// --- 1. MTN MOMO COLLECTION API ---
app.post('/api/donate/mtn', async (req, res) => {
    try {
        const { amount, phone, description } = req.body;
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
            currency: "EUR", // Note: MTN Sandbox defaults to EUR/UGX depending on config; use "UGX" for live production
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

        res.json({ success: true, referenceId, message: "MTN USSD prompt sent to your phone!" });
    } catch (error) {
        console.error("MTN Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
});

// --- 2. AIRTEL MONEY COLLECTION API ---
app.post('/api/donate/airtel', async (req, res) => {
    try {
        const { amount, phone, description } = req.body;
        const referenceId = uuidv4();
        const env = process.env.AIRTEL_ENVIRONMENT || 'sandbox';
        const baseUrl = env === 'production'
            ? 'https://openapi.airtel.africa'
            : 'https://openapi.airtel.africa'; // Airtel sandbox uses same base with test tokens

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

        res.json({ success: true, referenceId, message: "Airtel USSD prompt sent to your phone!" });
    } catch (error) {
        console.error("Airtel Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
});

app.listen(PORT, () => console.log(`NCF Payment Server running on port ${PORT}`));