"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, Progress, Avatar, Tag, Typography, Row, Col, Divider, Spin, Alert, Tabs, Button, message } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  CheckCircleFilled,
  MailOutlined,
  BankOutlined,
  UserOutlined,
  GithubOutlined,
  DisconnectOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function MyInternship() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [availableInternships, setAvailableInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingOthers, setLoadingOthers] = useState(true);
  
  // State for tracking which courses the user has clicked "Enroll" on locally before refresh
  const [enrolledCourses, setEnrolledCourses] = useState({});

  const searchParams = useSearchParams();
  const router = useRouter();

  // GitHub status state
  const [githubStatus, setGithubStatus] = useState({ isConnected: false, clientId: null });

  useEffect(() => {
    const handleOAuthCallback = async (code) => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/v1/github/auth', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ code })
        });
        const data = await res.json();
        if (data.success) {
          message.success('Successfully connected to GitHub!');
        } else {
          message.error(data.message || 'Failed to connect');
        }
      } catch (err) {
        message.error('An error occurred during authentication');
      } finally {
        router.replace('/student/dashboard/internships'); // Adjust if route differs
        fetchGithubStatus();
      }
    };
    const fetchMyInternship = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/internships/current', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          setError("You are not currently assigned to an internship.");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch internship details');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchOthers = async () => {
      try {
        const token = localStorage.getItem('token');
        const [internshipsRes, applicationsRes] = await Promise.all([
          fetch('/api/v1/internships', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/v1/student/applications', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        if (internshipsRes.ok) {
          setAvailableInternships(await internshipsRes.json());
        }
        if (applicationsRes.ok) {
          setApplications(await applicationsRes.json());
        }
      } catch(e) {
        console.error("Error fetching other data:", e);
      } finally {
        setLoadingOthers(false);
      }
    };

    const fetchGithubStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/v1/github/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setGithubStatus(data);
        }
      } catch(e) {
        console.error("Error fetching github status:", e);
      }
    };

    fetchMyInternship();
    fetchOthers();
    
    const code = searchParams.get('code');
    if (code) {
      handleOAuthCallback(code);
    } else {
      fetchGithubStatus();
    }
  }, [searchParams]);

  let inProgressContent = null;

  if (loading) {
    inProgressContent = <div className="flex justify-center items-center min-h-[60vh]"><Spin size="large" /></div>;
  } else if (error) {
    inProgressContent = (
      <div className="p-8 max-w-4xl mx-auto">
        <Alert 
          title="No Active Internship" 
          description={error} 
          type="info" 
          showIcon 
          className="rounded-xl border-blue-200 bg-blue-50"
        />
      </div>
    );
  } else if (!data || !data.internship) {
    inProgressContent = <div className="py-8 text-center text-slate-500">No active internship found.</div>;
  } else {
    const internship = data.internship;
    const mentor = internship.mentor || { name: 'Unassigned', email: 'N/A' };
    
    // Transform DB techStack (string array) or technology (comma string) into objects
    const rawTech = internship.techStack?.length > 0 
      ? internship.techStack 
      : (internship.technology ? internship.technology.split(',').map(s => s.trim()) : []);
      
    const colors = ['blue', 'green', 'cyan', 'success', 'orange', 'geekblue', 'purple', 'magenta'];
    const technologies = rawTech.map((tech, i) => ({
      name: tech,
      color: colors[i % colors.length]
    }));

    const learningOutcomes = [
      `Master core concepts of ${technologies[0]?.name || 'the tech stack'}`,
      `Build real-world projects and scalable architecture`,
      `Collaborate effectively in a modern development environment`,
      `Improve problem-solving and algorithmic thinking`,
      `Learn enterprise best practices for deployment and CI/CD`
    ];

    inProgressContent = (
      <div className="space-y-8 mt-6">
        <Card className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden" styles={{ body: { padding: 0 } }}>
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 p-8 text-white relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>

            <div className="relative z-10">
              <div className="mb-6 max-w-4xl">
                <Title level={2} className="!text-white !mb-3">{internship.title}</Title>
                <Paragraph className="text-blue-100 text-base leading-relaxed max-w-3xl">
                  {internship.description}
                </Paragraph>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <Tag className="px-3 py-1.5 bg-white/10 border-white/20 text-white rounded-md flex items-center gap-2 text-sm font-medium backdrop-blur-sm">
                  <ClockCircleOutlined /> Duration: {internship.duration || 'N/A'}
                </Tag>
                <Tag className="px-3 py-1.5 bg-white/10 border-white/20 text-white rounded-md flex items-center gap-2 text-sm font-medium backdrop-blur-sm">
                  <CalendarOutlined /> Started: {new Date(data.startDate).toLocaleDateString()}
                </Tag>
                {data.endDate && (
                  <Tag className="px-3 py-1.5 bg-white/10 border-white/20 text-white rounded-md flex items-center gap-2 text-sm font-medium backdrop-blur-sm">
                    <FlagOutlined /> Ends: {new Date(data.endDate).toLocaleDateString()}
                  </Tag>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 max-w-2xl shadow-inner">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <Text className="text-blue-200 uppercase text-xs font-bold tracking-wider block mb-1">Live Progress</Text>
                    <Text className="text-white font-medium">
                      Week {data.currentWeek} <span className="mx-2 opacity-50">|</span> Day {data.currentDay}
                    </Text>
                  </div>
                  <div className="text-right">
                    <Text className="text-white font-bold text-xl">{Math.round(data.progress)}%</Text>
                    <Text className="text-blue-200 uppercase text-xs font-bold tracking-wider block">Completed</Text>
                  </div>
                </div>
                <Progress
                  percent={Math.round(data.progress)}
                  showInfo={false}
                  strokeColor={{ '0%': '#60a5fa', '100%': '#34d399' }}
                  railColor="rgba(255,255,255,0.2)"
                  size={10}
                  className="!m-0"
                />
              </div>
            </div>
          </div>
        </Card>

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16} className="space-y-8">
            <Card className="rounded-2xl border-slate-200 shadow-sm" styles={{ body: { padding: '32px' } }}>
              <Title level={4} className="!mb-6 text-slate-800">What will you learn?</Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircleFilled className="text-blue-500 text-lg mt-0.5 shrink-0" />
                    <Text className="text-slate-600 font-medium leading-relaxed">{outcome}</Text>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl border-slate-200 shadow-sm" styles={{ body: { padding: '32px' } }}>
              <Title level={4} className="!mb-6 text-slate-800">Technologies</Title>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech, index) => (
                  <Tag
                    key={index}
                    color={tech.color}
                    className="px-4 py-2 text-sm rounded-lg font-semibold border-opacity-50 m-0 hover:scale-105 transition-transform cursor-default"
                  >
                    {tech.name}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="rounded-2xl border-slate-200 shadow-sm sticky top-8" styles={{ body: { padding: 0 } }}>
              <div className="bg-slate-100 p-6 flex flex-col items-center justify-center border-b border-slate-200 rounded-t-2xl">
                <Avatar
                  size={96}
                  src={mentor.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${mentor.name}&backgroundColor=b6e3f4`}
                  icon={<UserOutlined />}
                  className="shadow-md border-4 border-white mb-4 bg-white text-blue-500"
                />
                <Tag color="blue" className="rounded-full px-3 uppercase tracking-wider text-xs font-bold border-blue-200 mb-2">Assigned Mentor</Tag>
                <Title level={4} className="!mb-1 text-slate-800 text-center">{mentor.name}</Title>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <Text className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1 block">Email Address</Text>
                  <div className="flex items-center gap-2">
                    <MailOutlined className="text-slate-400" />
                    <a href={`mailto:${mentor.email}`} className="text-blue-600 font-medium hover:underline break-all">
                      {mentor.email}
                    </a>
                  </div>
                </div>

                <Divider className="my-0 border-slate-100" />

                <div>
                  <Text className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1 block">Department</Text>
                  <div className="flex items-center gap-2">
                    <BankOutlined className="text-slate-400" />
                    <Text className="text-slate-700 font-medium">{mentor.department || 'Engineering'}</Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* GITHUB INTEGRATION CARD */}
            <Card className="rounded-2xl border-slate-200 shadow-sm sticky top-8 mt-8" styles={{ body: { padding: 0 } }}>
              <div className="bg-slate-100 p-6 flex flex-col items-center justify-center border-b border-slate-200 rounded-t-2xl">
                <Avatar
                  size={96}
                  src={githubStatus.isConnected ? `https://github.com/${githubStatus.username}.png` : null}
                  icon={!githubStatus.isConnected ? <GithubOutlined /> : null}
                  className={`shadow-md border-4 border-white mb-4 ${!githubStatus.isConnected ? 'bg-slate-200 text-slate-400' : 'bg-white text-blue-500'}`}
                />
                <Tag color={githubStatus.isConnected ? "success" : "default"} className="rounded-full px-3 uppercase tracking-wider text-xs font-bold mb-2">
                  Status: {githubStatus.isConnected ? 'Connected' : 'Not Connected'}
                </Tag>
                <Title level={4} className="!mb-1 text-slate-800 text-center">GitHub</Title>
              </div>

              <div className="p-6 space-y-5 text-center">
                {githubStatus.isConnected ? (
                  <>
                    <div>
                      <Text className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1 block">Username</Text>
                      <Text className="text-slate-700 font-medium">@{githubStatus.username}</Text>
                    </div>
                    <Button 
                      type="default" 
                      danger
                      icon={<DisconnectOutlined />}
                      className="w-full rounded-xl font-bold"
                      onClick={() => {
                        /* Provide dummy disconnect logic or link */
                      }}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <Text className="text-slate-500 text-sm mb-4 block">
                      Connect your GitHub account to sync your repositories and track your coding progress.
                    </Text>
                    <Button 
                      type="primary" 
                      icon={<GithubOutlined />}
                      className="w-full rounded-xl font-bold bg-slate-900 hover:bg-slate-800"
                      size="large"
                      onClick={() => {
                        if (githubStatus.clientId) {
                          // Redirect to GithubAuth
                          window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubStatus.clientId}&scope=repo`;
                        } else {
                          // clientId not loaded or available
                          console.error('Github clientId not found');
                          message.error('GitHub Client ID is not configured in your .env file!');
                        }
                      }}
                    >
                      Connect GitHub
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  const completedContent = (
    <div className="py-16 flex flex-col items-center justify-center text-slate-500">
      <CheckCircleFilled className="text-4xl text-slate-300 mb-4" />
      <Text className="text-lg font-medium text-slate-500">No completed internships yet</Text>
    </div>
  );

  const myInternshipsItems = [
    { key: 'in-progress', label: 'In Progress', children: inProgressContent },
    { key: 'completed', label: 'Completed', children: completedContent },
  ];

  const handleEnroll = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/student/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ internshipId: id })
      });
      
      if (response.ok) {
        setEnrolledCourses(prev => ({ ...prev, [id]: true }));
        // Refresh applications
        const appsRes = await fetch('/api/v1/student/applications', { headers: { 'Authorization': `Bearer ${token}` } });
        if (appsRes.ok) setApplications(await appsRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const allInternshipsContent = (
    <div className="py-8">
      {loadingOthers ? (
        <div className="flex justify-center py-8"><Spin /></div>
      ) : (
        <Row gutter={[24, 24]}>
          {availableInternships.map(course => {
            const hasApplied = applications.find(a => a.internshipId === course.id) || enrolledCourses[course.id];
            const status = hasApplied ? hasApplied.status : null;
            
            return (
              <Col xs={24} md={12} lg={8} key={course.id}>
                <Card className="rounded-2xl border-slate-200 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex-grow">
                    <Title level={4} className="!mb-2 !mt-0">{course.title}</Title>
                    <Text className="text-slate-500 block mb-3"><ClockCircleOutlined /> {course.duration || 'N/A'}</Text>
                    <Paragraph className="text-slate-600 mb-4">{course.description || course.companyName}</Paragraph>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(course.techStack || []).map(t => (
                        <Tag key={t} color="blue" className="rounded-md m-0">{t}</Tag>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    {status === 'PENDING' || enrolledCourses[course.id] ? (
                      <Alert 
                        title="Application Pending" 
                        description="Waiting for mentor approval" 
                        type="warning" 
                        showIcon 
                        className="rounded-lg"
                      />
                    ) : status === 'ACCEPTED' ? (
                      <Alert 
                        title="Accepted!" 
                        type="success" 
                        showIcon 
                        className="rounded-lg"
                      />
                    ) : status === 'REJECTED' ? (
                       <Alert 
                        title="Application Rejected" 
                        type="error" 
                        showIcon 
                        className="rounded-lg"
                      />
                    ) : (
                      <Button 
                        type="primary" 
                        className="w-full h-10 rounded-xl font-semibold shadow-sm" 
                        onClick={() => handleEnroll(course.id)}
                      >
                        Apply Now
                      </Button>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );

  const mainTabsItems = [
    { key: 'my-internships', label: 'My Internships', children: <Tabs defaultActiveKey="in-progress" items={myInternshipsItems} className="mt-2" /> },
    { key: 'wishlist', label: 'Wishlist', children: <div className="py-16 text-center text-slate-500 text-lg">Your wishlist is empty.</div> },
    { key: 'all-internships', label: 'All Internships', children: allInternshipsContent },
  ];

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-full">
      <Tabs defaultActiveKey="my-internships" items={mainTabsItems} size="large" />
    </div>
  );
}
