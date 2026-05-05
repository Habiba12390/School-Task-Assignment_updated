document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email    = document.getElementById('user_email').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    try {
      const response = await fetch('/login-api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Email or password is incorrect. Please try again.');
        return;
      }

      window.location.href = data.redirect_url;

    } catch (err) {
      alert('Could not reach the server. Make sure the backend is running.');
    }
  });
});