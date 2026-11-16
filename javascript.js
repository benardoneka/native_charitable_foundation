async function processLiveDonation(provider, amount, phone) {
    // Netlify automatically routes this to your backend function!
    const endpoint = '/.netlify/functions/donate';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider, amount, phone, description: "NCF Community Support" })
        });
        
        const data = await response.json();
        if(data.success) {
            alert("STK Push triggered! Check your phone and enter your PIN.");
        } else {
            alert("Error: " + JSON.stringify(data.error));
        }
    } catch (err) {
        alert("Failed to connect to backend server.");
    }
}