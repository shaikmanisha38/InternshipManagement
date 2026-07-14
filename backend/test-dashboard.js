async function testDashboardFull() {
  try {
    console.log('--- Testing Dashboard Full Flow ---');
    
    // 1. Signup a new user
    const unique = Date.now();
    const signupRes = await fetch('http://localhost:3000/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: 'Dash Tester',
        email: `dashtester${unique}@test.com`,
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
      body: JSON.stringify({ email: `dashtester${unique}@test.com`, password: 'password123' })
    });
    
    if (!loginRes.ok) {
      console.log('Login failed:', loginRes.status, await loginRes.text());
      return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    console.log('1. Login successful');
    
    // 3. Assign internship
    console.log('2. Assigning internship...');
    const assignRes = await fetch('http://localhost:3000/api/v1/internships/assign', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!assignRes.ok) {
        console.log('Assign failed:', assignRes.status, await assignRes.text());
        // We can continue to see if dashboard still works
    }
    
    // 4. Fetch Dashboard
    console.log('3. Fetching dashboard summary...');
    const dashRes = await fetch('http://localhost:3000/api/v1/student/dashboard/summary', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!dashRes.ok) {
      console.log('Dashboard fetch failed:', dashRes.status, await dashRes.text());
      return;
    }
    
    const dashData = await dashRes.json();
    console.log('Dashboard fetched successfully:', Object.keys(dashData));
    console.log('User:', dashData.user.name);
    console.log('Internship:', dashData.internship ? dashData.internship.title : 'None');
    
  } catch (err) {
    console.error('Test script error:', err);
  }
}

testDashboardFull();
