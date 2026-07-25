const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: "postgresql://internship_vc13_user:FNKEws70DZXefyGCuIxaod3nA9GrEDyE@dpg-d9abo2po3t8c738kf65g-a.singapore-postgres.render.com/internship_vc13",
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting using pg...');
    await client.connect();
    console.log('SUCCESS: Connected to database using node-postgres!');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from DB:', res.rows[0]);
  } catch (err) {
    console.error('ERROR connecting to DB:', err.message);
  } finally {
    await client.end();
  }
}

testConnection();
