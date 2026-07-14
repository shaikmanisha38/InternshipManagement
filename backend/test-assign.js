async function test() {
  try {
    // 1. Signup a new user
    const unique = Date.now();
    const signupRes = await fetch('http://localhost:3000/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: 'Auto Assign Tester',
        email: `tester${unique}@test.com`,
        password: 'password123',
        role: 'STUDENT'
      })
    });
    
    if (!signupRes.ok) {
      console.log('Signup failed:', signupRes.status, await signupRes.text());
      return;
    }
    
    // 2. Login
    const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `tester${unique}@test.com`, password: 'password123' })
    });
    
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    
    // 3. Assign Internships
    const assignRes = await fetch('http://localhost:3000/api/v1/internships/assign', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Assign status:', assignRes.status);
    const assignData = await assignRes.json();
    console.log('Assign response:', JSON.stringify(assignData, null, 2));
    
  } catch (err) {
    console.error('Script Error:', err);
  }
}

test();
