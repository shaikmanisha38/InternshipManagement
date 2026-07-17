"use client";
import React, { useState, useEffect } from 'react';
import { Card, Typography, Avatar, Tag, Button, Row, Col, Divider, Switch, Tooltip, Skeleton, message, Alert } from 'antd';
import { 
  GithubOutlined, 
  ClockCircleOutlined, 
  LockOutlined,
  BranchesOutlined,
  ApiOutlined,
  UsergroupAddOutlined,
  CheckCircleFilled,
  LinkOutlined,
  SyncOutlined,
  DisconnectOutlined
} from '@ant-design/icons';
import Cookies from 'js-cookie';

const { Title, Text, Paragraph } = Typography;

export default function GithubIntegration() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ isConnected: false });
  const [webhookSaving, setWebhookSaving] = useState(false);

  useEffect(() => {
    // Check for error/success params in URL
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    const successParam = params.get('success');

    if (errorParam === 'not_configured') {
      message.error('GitHub integration is not configured. Please add OAuth keys to your .env file.', 5);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (errorParam) {
      message.error(`GitHub Connection Failed: ${errorParam}`, 5);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (successParam) {
      message.success('GitHub Account Connected Successfully!', 5);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/github/status', {
        headers: { 'Authorization': `Bearer ${Cookies.get('token')}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to load GitHub integration status.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    window.location.href = '/api/v1/github/auth';
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/github/disconnect', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${Cookies.get('token')}` }
      });
      if (res.ok) {
        setData({ isConnected: false });
        message.success('GitHub account disconnected.');
      } else {
        message.error('Failed to disconnect account.');
        setLoading(false);
      }
    } catch (error) {
      message.error('An error occurred.');
      setLoading(false);
    }
  };

  const handleWebhookToggle = async (checked) => {
    try {
      setWebhookSaving(true);
      const res = await fetch('/api/v1/github/webhook', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active: checked })
      });
      
      const json = await res.json();
      
      if (res.ok) {
        message.success(json.message);
        setData(prev => ({ ...prev, webhookActive: checked }));
      } else {
        message.error(json.message || 'Failed to update webhook.');
      }
    } catch (error) {
      message.error('An error occurred.');
    } finally {
      setWebhookSaving(false);
    }
  };

  const timeAgo = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6 bg-blue-50/50 min-h-full">
        <Skeleton active paragraph={{ rows: 2 }} />
        <Card className="rounded-2xl border-slate-200 mt-6"><Skeleton active avatar={{ size: 72, shape: 'circle' }} paragraph={{ rows: 3 }} /></Card>
      </div>
    );
  }

  const { isConnected, username, avatar, repository, repositoryUrl, isPrivate, defaultBranch, lastCommitAt, totalCommits = 0, contributorsCount = 0, webhookActive = false } = data;

  return (
    <div className="p-4 md:p-8 space-y-6 bg-blue-50/50 min-h-full">
      <div className="mb-8">
        <Title level={2} className="!text-slate-900 !mb-2">GitHub Integration</Title>
        <Text className="text-slate-700 font-medium text-base">Manage your repository connection, synchronize progress, and configure webhooks.</Text>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* ZONE 1: CONNECTION PROFILE CARD */}
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white" styles={{ body: { padding: '32px' } }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            <div className="flex items-start gap-5">
              <Avatar 
                size={72} 
                src={isConnected ? avatar : null}
                icon={!isConnected && <GithubOutlined />}
                className={`shadow-md border border-slate-200 ${!isConnected && 'bg-slate-100 text-slate-400'}`} 
              />
              <div className="space-y-3 mt-1">
                <div>
                  <Title level={4} className="!text-slate-900 !m-0 flex items-center gap-2">
                    {isConnected ? username : 'Not Connected'}
                  </Title>
                  <Text className="text-slate-500 font-medium text-sm">Authenticated User Account</Text>
                </div>
                
                {isConnected && repository && (
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <Text className="text-slate-700 font-bold text-sm">Active Repository:</Text>
                      <a href={repositoryUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1">
                        {username}/{repository} <LinkOutlined />
                      </a>
                      <Tag className="px-2 py-0.5 bg-blue-50 border-blue-200 text-blue-700 font-bold rounded m-0 flex items-center gap-1">
                        <BranchesOutlined /> {defaultBranch || 'main'}
                      </Tag>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mt-2">
                      <span className="flex items-center gap-1.5"><ClockCircleOutlined /> Last Commit: {timeAgo(lastCommitAt)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
              <div>
                <Text className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-2 text-left md:text-right">Connection Status</Text>
                {isConnected ? (
                  <Tag className="px-4 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-lg m-0 flex items-center gap-2 text-sm w-max">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    Connected & Syncing
                  </Tag>
                ) : (
                  <Tag className="px-4 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 font-bold rounded-lg m-0 flex items-center gap-2 text-sm w-max">
                    <span className="relative flex h-2 w-2 rounded-full bg-amber-500"></span>
                    Disconnected
                  </Tag>
                )}
              </div>
              
              <Button 
                type="default" 
                size="large"
                icon={isConnected ? <DisconnectOutlined /> : <GithubOutlined />}
                onClick={isConnected ? handleDisconnect : handleConnect}
                className={`rounded-xl font-bold border-slate-200 shadow-sm w-full md:w-auto transition-colors ${isConnected ? 'text-slate-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50' : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900'}`}
              >
                {isConnected ? 'Disconnect Account' : 'Connect GitHub'}
              </Button>
            </div>

          </div>
        </Card>

        {/* ZONE 2: REPOSITORY META-DETAILS */}
        {isConnected && repository && (
          <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white" title={<Text className="text-slate-900 font-bold text-lg flex items-center gap-2" styles={{ body: { padding: '32px' } }}><ApiOutlined className="text-slate-400" /> Repository & Sync Details</Text>}
            headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 32px', minHeight: 'auto' }}
          >
            <Row gutter={[32, 32]}>
              
              <Col xs={24} lg={12} className="space-y-6">
                <div>
                  <Text className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-4">Metadata Overview</Text>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <Text className="text-slate-500 font-bold text-sm">Target Repository</Text>
                      <Text className="text-slate-900 font-bold">{repository}</Text>
                    </div>
                    <Divider className="my-0 border-slate-200" />
                    <div className="flex justify-between items-center">
                      <Text className="text-slate-500 font-bold text-sm">Visibility Status</Text>
                      {isPrivate ? (
                        <Tooltip title="This repository is securely locked.">
                          <Tag className="m-0 bg-white border border-slate-200 text-slate-700 font-bold rounded flex items-center gap-1.5 px-2 py-0.5">
                            <LockOutlined className="text-slate-400" /> Private
                          </Tag>
                        </Tooltip>
                      ) : (
                        <Tag className="m-0 bg-white border border-slate-200 text-slate-700 font-bold rounded flex items-center gap-1.5 px-2 py-0.5">
                          Public
                        </Tag>
                      )}
                    </div>
                    <Divider className="my-0 border-slate-200" />
                    <div className="flex justify-between items-center">
                      <Text className="text-slate-500 font-bold text-sm">Default Branch</Text>
                      <Text className="text-slate-900 font-bold font-mono text-sm bg-white px-2 py-0.5 rounded border border-slate-200">{defaultBranch || 'main'}</Text>
                    </div>
                  </div>
                </div>

                <div>
                  <Text className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-4">Quantitative Statistics</Text>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:border-blue-300 transition-colors cursor-default shadow-sm shadow-blue-900/5">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <BranchesOutlined className="text-blue-600 text-lg" />
                      </div>
                      <div>
                        <Title level={3} className="!text-slate-900 !m-0 leading-none">{totalCommits}</Title>
                        <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider">Total Commits</Text>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:border-blue-300 transition-colors cursor-default shadow-sm shadow-blue-900/5">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                        <UsergroupAddOutlined className="text-purple-600 text-lg" />
                      </div>
                      <div>
                        <Title level={3} className="!text-slate-900 !m-0 leading-none">{contributorsCount}</Title>
                        <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider">Contributors</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <div className="h-full bg-blue-100 border border-blue-300 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-md shadow-blue-900/10 relative overflow-hidden">
                  <GithubOutlined className="absolute -right-8 -bottom-8 text-blue-500 opacity-15 text-9xl transform -rotate-12 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <SyncOutlined className={`text-blue-600 ${webhookActive && 'animate-spin-slow'} text-lg`} />
                      <Text className="text-blue-700 uppercase text-xs font-bold tracking-widest">Automated Synchronization</Text>
                    </div>
                    <Title level={3} className="!text-slate-900 !mb-4 !mt-0">Grading Webhook Pipeline</Title>
                    <Paragraph className="text-slate-700 font-medium text-sm leading-relaxed max-w-md">
                      Your repository is actively linked to our grading infrastructure. Pushes to the default branch will automatically trigger evaluation checks.
                    </Paragraph>
                  </div>

                  <div className="space-y-4 mt-8 relative z-10">
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex justify-between items-center transition-colors hover:border-blue-300">
                      <div className="flex items-center gap-3">
                        <CheckCircleFilled className="text-emerald-500 text-lg" />
                        <div>
                          <Text className="text-slate-900 font-bold block leading-tight">API Connection</Text>
                          <Text className="text-slate-500 font-medium text-xs">Authenticating via OAuth App</Text>
                        </div>
                      </div>
                      <Tag className="m-0 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-md px-3 py-0.5">Connected</Tag>
                    </div>

                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex justify-between items-center transition-colors hover:border-blue-300">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${webhookActive ? 'border-emerald-500' : 'border-slate-300'} flex items-center justify-center p-[2px]`}>
                          <div className={`w-full h-full rounded-full ${webhookActive ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                        </div>
                        <div>
                          <Text className="text-slate-900 font-bold block leading-tight">Payload Webhook</Text>
                          <Text className="text-slate-500 font-medium text-xs">Listening for push events</Text>
                        </div>
                      </div>
                      <Switch 
                        checked={webhookActive} 
                        loading={webhookSaving}
                        onChange={handleWebhookToggle} 
                        className={webhookActive ? "bg-emerald-500" : "bg-slate-300"} 
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        )}
      </div>
    </div>
  );
}
