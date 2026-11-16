const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const { provider, amount, phone, description } = JSON.parse(event.body);
        const referenceId = uuidv4();
        const env = process.env.MTN_ENVIRONMENT || 'sandbox';

        if (provider === 'mtn') {
            // 1. MTN Token
            const auth = Buffer.from(`${process.env.MTN_API_USER}:${process.env.MTN_API_KEY}`).toString('base64');
            const tokenRes = await axios.post('https://sandbox.momodeveloper.mtn.com/collection/token/', {}, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY
                }
            });
            const accessToken = tokenRes.data.access_token;

            // 2. MTN Request To Pay
            await axios.post('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay', {
                amount: amount.toString(),
                currency: "EUR",
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

            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, referenceId, message: "MTN USSD prompt sent!" })
            };
        } 

        // Add Airtel logic here similarly if needed...

        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: "Invalid provider" })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.response?.data || error.message })
        };
    }
};