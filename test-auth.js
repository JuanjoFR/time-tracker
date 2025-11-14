// Quick test script to verify anonymous authentication is working
// Run this in the browser console on localhost:3000

console.log('Testing anonymous authentication...');

// Test the auth system
async function testAuth() {
  try {
    // Check if Supabase client is working
    const response = await fetch('/api/test-auth', {
      method: 'POST',
    });

    if (!response.ok) {
      console.error('Auth test failed:', response.statusText);
      return;
    }

    const result = await response.json();
    console.log('Auth test result:', result);
  } catch (error) {
    console.error('Error testing auth:', error);
  }
}

// Check if user is signed in through the auth provider
function checkAuthProvider() {
  const authContext = window.React?.createContext;
  console.log('Auth provider loaded:', !!authContext);
}

console.log('Run testAuth() to test authentication');
console.log('Check browser Network tab for auth requests');
