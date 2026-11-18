// services/paymentService.js
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Helper to resolve the active PawaPay Base URL from .env
function getPawaPayBaseUrl() {
    const env = process.env.PAWAPAY_ENVIRONMENT || 'sandbox';
    return env === 'production'
        ? (process.env.PAWAPAY_PRODUCTION_URL || 'https://api.pawapay.io')
        : (process.env.PAWAPAY_SANDBOX_URL || 'https://api.sandbox.pawapay.io');
}

// --- 1. PawaPay Deposit Service ---
async function handlePawaPayDonation(amount, phone, description, correspondentInput, currencyInput) {
    const depositId = uuidv4();
    const baseUrl = getPawaPayBaseUrl(); // <-- Defined cleanly in scope

    const correspondent = correspondentInput || "MTN_MOMO_UGA";
    const currency = currencyInput || "UGX";
    const customerTimestamp = new Date().toISOString();

    const response = await axios.post(`${baseUrl}/deposits`, {
        depositId: depositId,
        amount: amount.toString(),
        currency: currency,
        correspondent: correspondent,
        payer: {
            type: "MSISDN",
            address: { value: phone }
        },
        customerTimestamp: customerTimestamp,
        statementDescription: description || "NCF Donation"
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.PAWAPAY_API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });

    return { success: true, depositId, currencyUsed: currency, data: response.data };
}

// --- 2. PawaPay Active Config Service ---
async function getPawaPayConfig() {
    const baseUrl = getPawaPayBaseUrl(); // <-- Defined cleanly in scope

    const response = await axios.get(`${baseUrl}/v2/active-conf`, {
        headers: {
            'Authorization': `Bearer ${process.env.PAWAPAY_API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data;
}

// --- 3. MTN Donation Service ---
async function handleMtnDonation(amount, phone, description) {
    const referenceId = uuidv4();
    const env = process.env.MTN_ENVIRONMENT || 'sandbox';
    const baseUrl = env === 'production' 
        ? 'https://momo.mtn.com' 
        : 'https://sandbox.momodeveloper.mtn.com';

    const auth = Buffer.from(`${process.env.MTN_API_USER}:${process.env.MTN_API_KEY}`).toString('base64');
    const tokenRes = await axios.post(`${baseUrl}/collection/token/`, {}, {
        headers: {
            'Authorization': `Basic ${auth}`,
            'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY
        }
    });
    const accessToken = tokenRes.data.access_token;

    await axios.post(`${baseUrl}/collection/v1_0/requesttopay`, {
        amount: amount.toString(),
        currency: env === 'production' ? "UGX" : "EUR",
        externalId: referenceId,
        payer: { partyIdType: "MSISDN", partyId: phone },
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

    return { success: true, referenceId };
}

// --- 4. Airtel Donation Service ---
async function handleAirtelDonation(amount, phone, description) {
    const referenceId = uuidv4();
    const baseUrl = 'https://openapi.airtel.africa';

    const tokenRes = await axios.post(`${baseUrl}/auth/oauth2/token`, {
        client_id: process.env.AIRTEL_CLIENT_ID,
        client_secret: process.env.AIRTEL_CLIENT_SECRET,
        grant_type: "client_credentials"
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
    const accessToken = tokenRes.data.access_token;

    await axios.post(`${baseUrl}/merchant/v1/payments/`, {
        reference: referenceId,
        subscriber: {
            country: process.env.AIRTEL_COUNTRY || "UG",
            currency: process.env.AIRTEL_CURRENCY || "UGX",
            msisdn: phone
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

    return { success: true, referenceId };
}

module.exports = {
    handlePawaPayDonation,
    getPawaPayConfig,
    handleMtnDonation,
    handleAirtelDonation
};