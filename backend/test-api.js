const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();

async function testEndpoint() {
  const student = await prisma.user.findFirst({ where: { email: 'student@test.com' } });
  if (!student) {
    console.log('Student not found');
    return;
  }
  
  const payload = {
    userId: student.id,
    email: student.email,
    role: 'STUDENT'
  };
  
  // Need the JWT_SECRET from .env
  const secret = process.env.JWT_SECRET || 'secret';
  const token = jwt.sign(payload, secret);
  
  console.log('Token generated:', token);
  
  const response = await fetch('http://localhost:3000/api/v1/student/dashboard/summary', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Data:', JSON.stringify(data, null, 2));
}

testEndpoint().finally(() => prisma.$disconnect());
