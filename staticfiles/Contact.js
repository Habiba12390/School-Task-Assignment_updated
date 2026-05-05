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

        if (name && email && message) {
            showSuccessMessage('Your message has been sent successfully! ✅');
            
            contactForm.reset();
            
            setTimeout(() => {
                window.location.href = "Home.html";
            }, 2500);
        }
    });
});