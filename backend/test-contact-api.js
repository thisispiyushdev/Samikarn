// using native fetch API available in Node.js 18+

// Get URL from command line argument, or use default local URL
const args = process.argv.slice(2);
const TEST_URL = args[0] || 'http://localhost:5000/api/contact';

const testContactAPI = async () => {
  console.log(`Starting contact form API test to ${TEST_URL}...`);

  const testPayload = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test' + Date.now() + '@example.com',
    phone: '9876543210',
    message: 'This is an automated test message from the test script.'
  };

  try {
    // If you are using Node.js v18 or newer, fetch is built-in.
    // If you are using an older version, you might need to install node-fetch: npm install node-fetch
    const response = await fetch(TEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Success! Contact form submitted successfully.');
      console.log('Response from server:', data);
    } else {
      console.error('❌ Failed! Server returned an error.');
      console.error('Status Code:', response.status);
      console.error('Response from server:', data);
    }
  } catch (error) {
    console.error('❌ Error during API call. Is the server running?');
    console.error('Error details:', error.message);
  }
};

testContactAPI();
