const fs = require('fs');
const txt = fs.readFileSync('components/pages/DashboardHome.jsx', 'utf8');

const prefix = `"use client";
import React, { useState, useEffect } from 'react';
import { Card, Progress, Avatar, Tag, Typography, Row, Col, Tooltip, Button, Timeline, Badge, Space, Spin, Alert } from 'antd';
import { 
  FireFilled, 
  TrophyOutlined, 
  CheckCircleFilled,
  ClockCircleOutlined,
  GithubOutlined,
  BulbOutlined,
  WarningFilled,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function DashboardHome() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/student/dashboard/summary', {
          headers: {
            'Authorization': \`Bearer \${token}\`
          }
        });

        if (!response.ok) {
          let errMsg = 'Failed to fetch dashboard data';
          try {
             const errData = await response.json();
             errMsg = errData.message || errMsg;
          } catch(e) {}
          throw new Error(\`\${response.status}: \${errMsg}\`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
`;

const tailIndex = txt.indexOf('fetchDashboard();');
if (tailIndex !== -1) {
  const tail = txt.substring(tailIndex);
  fs.writeFileSync('components/pages/DashboardHome.jsx', prefix + '    };\n\n    ' + tail);
  console.log('Fixed DashboardHome.jsx');
} else {
  console.log('Could not find tail');
}
