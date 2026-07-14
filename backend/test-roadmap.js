async function testRoadmap() {
  try {
    console.log('--- Testing Roadmap Module ---');
    
    // 1. Signup a new user
    const unique = Date.now();
    const signupRes = await fetch('http://localhost:3000/api/v1/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: 'Roadmap Tester',
        email: `tester${unique}@test.com`,
        password: 'password123',
        role: 'STUDENT'
      })
    });
    
    // 2. Login
    const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `tester${unique}@test.com`, password: 'password123' })
    });
    
    if (!loginRes.ok) {
      console.log('Login failed:', loginRes.status, await loginRes.text());
      return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    console.log('1. Login successful');
    
    // Wait, the tester is not assigned an internship! We must assign one.
    const assignRes = await fetch('http://localhost:3000/api/v1/internships/assign', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Assign status:', assignRes.status);
    
    // 3. Fetch Current Roadmap
    const currentRes = await fetch('http://localhost:3000/api/v1/roadmap/current', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!currentRes.ok) {
      console.log('Failed to fetch current roadmap:', currentRes.status, await currentRes.text());
      return;
    }
    
    const currentData = await currentRes.json();
    console.log('2. Current Roadmap fetched successfully');
    console.log(`   Track: ${currentData.title}, Weeks: ${currentData.total_weeks}`);
    
    if (!currentData.weeks || currentData.weeks.length === 0) {
      console.log('   No weeks found in the roadmap to test further.');
      return;
    }
    
    const firstWeekId = currentData.weeks[0].id;
    const trackId = currentData.id;
    
    // 4. Fetch Week Details (Strict sorting check)
    const weekNumber = currentData.weeks[0].weekNumber;
    
    const weekRes = await fetch(`http://localhost:3000/api/v1/roadmap/week/${trackId}?weekNumber=${weekNumber}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!weekRes.ok) {
      console.log('Failed to fetch week details:', weekRes.status, await weekRes.text());
      return;
    }
    
    const weekData = await weekRes.json();
    console.log(`3. Week ${weekNumber} details fetched successfully`);
    console.log(`   Found ${weekData.days.length} days`);
    
    // Check strict sorting
    let isSorted = true;
    for (let i = 0; i < weekData.days.length - 1; i++) {
      if (weekData.days[i].dayNumber > weekData.days[i+1].dayNumber) {
        isSorted = false;
        break;
      }
    }
    console.log(`   Strict Sorting Validated: ${isSorted}`);
    
    if (weekData.days.length === 0) return;
    
    // 5. Fetch Day Details
    const dayId = weekData.days[0].id;
    const dayRes = await fetch(`http://localhost:3000/api/v1/roadmap/day/${dayId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!dayRes.ok) {
      console.log('Failed to fetch day details:', dayRes.status, await dayRes.text());
      return;
    }
    
    const dayData = await dayRes.json();
    console.log(`4. Day details fetched successfully (Day ${dayData.dayNumber})`);
    console.log(`   Tasks count: ${dayData.tasks.length}`);
    
    console.log('--- Roadmap Module Tests Passed ---');
    
  } catch (err) {
    console.error('Test script error:', err);
  }
}

testRoadmap();
