// Common authentication functions

// Verify if user is logged in
async function verifyAuth() {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return false;
    }
    
    const response = await fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}

// Get authentication token
function getAuthToken() {
  return localStorage.getItem('auth_token');
}

// Get headers with authentication
function getAuthHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// Logout function
function logout() {
  localStorage.removeItem('auth_token');
  window.location.href = 'login.html';
}

// Check if user is authenticated or redirect to login
async function checkAuthOrRedirect() {
  const isAuthenticated = await verifyAuth();
  
  if (!isAuthenticated) {
    window.location.href = 'login.html';
    return false;
  }
  
  return true;
}
