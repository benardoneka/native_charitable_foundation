// routes/donations.js
const express = require('express');
const router = express.Router();
const { 
    handlePawaPayDonation, 
    handleMtnDonation, 
    handleAirtelDonation,
    getPawaPayConfig // [FIXED] Imported missing configuration service
} = require('../services/paymentService');

// Fetch all active countries, currencies, and mobile networks
router.get('/pawapay/config', async (req, res) => {
    try {
        const config = await getPawaPayConfig();
        return res.json({ success: true, config });
    } catch (error) {
        console.error("PawaPay Config Error:", error.response?.data || error.message);
        return res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
});

// Unified donation router
router.post('/donate', async (req, res) => {
    // [FIXED] Destructured currency along with the rest of the body parameters
    const { provider, amount, phone, description, correspondent, currency } = req.body;
    if (!provider) {
        return res.status(400).json({ success: false, error: "Payment provider is required." });
    }

    try {
        const prov = provider.toLowerCase();
        let result;
        if (prov === 'mtn') {
            result = await handleMtnDonation(amount, phone, description);
        } else if (prov === 'airtel') {
            result = await handleAirtelDonation(amount, phone, description);
        } else if (prov === 'pawapay') {
            result = await handlePawaPayDonation(amount, phone, description, correspondent, currency);
        } else {
            return res.status(400).json({ success: false, error: "Invalid payment provider." });
        }
        return res.json(result);
    } catch (error) {
        console.error(`${provider.toUpperCase()} Error:`, error.response?.data || error.message);
        return res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
});

// Dedicated PawaPay Route
router.post('/donate/pawapay', async (req, res) => {
    try {
        const { amount, phone, description, correspondent, currency } = req.body;
        const result = await handlePawaPayDonation(amount, phone, description, correspondent, currency);
        return res.json(result);
    } catch (error) {
        console.error("PawaPay Error:", error.response?.data || error.message);
        return res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
});

// Dedicated MTN Route
router.post('/donate/mtn', async (req, res) => {
    try {
        const { amount, phone, description } = req.body;
        const result = await handleMtnDonation(amount, phone, description);
        return res.json(result);
    } catch (error) {
        console.error("MTN Error:", error.response?.data || error.message);
        return res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
});

// Dedicated Airtel Route
router.post('/donate/airtel', async (req, res) => {
    try {
        const { amount, phone, description } = req.body;
        const result = await handleAirtelDonation(amount, phone, description);
        return res.json(result);
    } catch (error) {
        console.error("Airtel Error:", error.response?.data || error.message);
        return res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
});

// PawaPay Webhook Callback Route
router.post('/pawapay/callback', express.json(), async (req, res) => {
    try {
        const callbackData = req.body;
        res.status(200).send({ received: true });

        const { depositId, status, amount, currency } = callbackData;
        console.log(`PawaPay Callback -> Deposit: ${depositId}, Status: ${status}, Amount: ${amount} ${currency}`);

        if (status === 'COMPLETED') {
            // TODO: Record successful donation in DB
        } else if (status === 'FAILED') {
            // TODO: Handle failed transaction
        }
    } catch (err) {
        console.error("PawaPay Callback Error:", err);
    }
});

module.exports = router;