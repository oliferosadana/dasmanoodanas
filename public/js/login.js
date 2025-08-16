document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const errorAlert = document.getElementById('errorAlert');
  
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validate inputs
    if (!username || !password) {
      showError('Username dan password harus diisi');
      return;
    }
    
    try {
      // Send login request to API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        showError(data.message || 'Login gagal');
        return;
      }
      
      // Store token in localStorage
      localStorage.setItem('auth_token', data.token);
      
      // Redirect to management page
      window.location.href = 'management.html';
      
    } catch (error) {
      console.error('Login error:', error);
      showError('Terjadi kesalahan saat login');
    }
  });
  
  function showError(message) {
    errorAlert.textContent = message;
    errorAlert.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      errorAlert.style.display = 'none';
    }, 5000);
  }
  
  // Check if user is already logged in
  function checkAuthStatus() {
    const token = localStorage.getItem('auth_token');
    
    // If there's a token and we're on the login page, redirect to management
    if (token) {
      window.location.href = 'management.html';
    }
  }
  
  // Check auth status when page loads
  checkAuthStatus();
});
