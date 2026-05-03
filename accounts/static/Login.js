const API = 'http://127.0.0.1:8000/api';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email    = document.getElementById('user_email').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();

    try {
      const response = await fetch(`${API}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Email or password is incorrect. Please try again.');
        return;
      }

      localStorage.setItem('yallado_role',  data.role);
      localStorage.setItem('yallado_email', email);
      localStorage.setItem('yallado_name',  data.name);

      if (data.role === 'admin') {
        window.location.href = 'Admin_dashboard.html';
      } else {
        window.location.href = 'Teacher_dashboard.html';
      }

    } catch (err) {
      alert('Could not reach the server. Make sure the backend is running.');
    }
  });
});
