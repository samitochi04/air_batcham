document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('newsletter-email');
    const subscribeBtn = document.getElementById('newsletter-subscribe');

    if (emailInput && subscribeBtn) {
        subscribeBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (!email) {
                alert('Please enter a valid email address.');
                return;
            }
            try {
                const response = await fetch('http://localhost:3000/email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                if (response.ok) {
                    alert('Thank you for subscribing!');
                    emailInput.value = '';
                } else {
                    alert('Subscription failed. Please try again.');
                }
            } catch (err) {
                alert('Could not connect to the server.');
            }
        });
    }
});