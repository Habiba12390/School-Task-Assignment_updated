document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('form');

    if (!contactForm) return;

    function showSuccessMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'success-message';
        messageContainer.textContent = message;
        document.body.appendChild(messageContainer);
        
        setTimeout(() => {
            messageContainer.remove();
        }, 3000);
    }

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); 
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        if (name && email && message) {
            fetch('/api/contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({ name, email, message })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccessMessage(data.message);
                    contactForm.reset();
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 2500);
                } else {
                    alert("Error: " + data.error);
                }
            })
            .catch(error => {
                console.error("Error sending message:", error);
                alert("An error occurred. Please try again later.");
            });
        }
    });
});