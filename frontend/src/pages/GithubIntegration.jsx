import React, { useState } from 'react';
import { Card, Typography, Avatar, Tag, Button, Row, Col, Space, Divider, Switch, Tooltip } from 'antd';
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

const { Title, Text, Paragraph } = Typography;

export default function GithubIntegration() {
  const [isConnected, setIsConnected] = useState(true);

  return (
    <div className="p-4 md:p-8 space-y-6 bg-blue-50/50 min-h-full">
      <div className="mb-8">
        <Title level={2} className="!text-slate-900 !mb-2">GitHub Integration</Title>
        <Text className="text-slate-700 font-medium text-base">Manage your repository connection, synchronize progress, and configure webhooks.</Text>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* ZONE 1: CONNECTION PROFILE CARD */}
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white" bodyStyle={{ padding: '32px' }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            
            {/* Left Side: Profile Info */}
            <div className="flex items-start gap-5">
              <Avatar 
                size={72} 
                src={isConnected ? "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" : null}
                icon={!isConnected && <GithubOutlined />}
                className={`shadow-md border border-slate-200 ${!isConnected && 'bg-slate-100 text-slate-400'}`} 
              />
              <div className="space-y-3 mt-1">
                <div>
                  <Title level={4} className="!text-slate-900 !m-0 flex items-center gap-2">
                    {isConnected ? 'alex-developer' : 'Not Connected'}
                  </Title>
                  <Text className="text-slate-500 font-medium text-sm">Authenticated User Account</Text>
                </div>
                
                {isConnected && (
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <Text className="text-slate-700 font-bold text-sm">Active Repository:</Text>
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1">
                        alex-developer/frontend-ecommerce <LinkOutlined />
                      </a>
                      <Tag className="px-2 py-0.5 bg-blue-50 border-blue-200 text-blue-700 font-bold rounded m-0 flex items-center gap-1">
                        <BranchesOutlined /> main
                      </Tag>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mt-2">
                      <span className="flex items-center gap-1.5"><ClockCircleOutlined /> Last Commit: 2 hours ago</span>
                      <span className="flex items-center gap-1.5"><ClockCircleOutlined /> Last Push: Just now</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Connection Status */}
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
                onClick={() => setIsConnected(!isConnected)}
                className={`rounded-xl font-bold border-slate-200 shadow-sm w-full md:w-auto transition-colors ${isConnected ? 'text-slate-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50' : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900'}`}
              >
                {isConnected ? 'Disconnect Account' : 'Connect GitHub'}
              </Button>
            </div>

          </div>
        </Card>

        {/* ZONE 2: REPOSITORY META-DETAILS */}
        {isConnected && (
          <Card 
            className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white" 
            bodyStyle={{ padding: '32px' }}
            title={<Text className="text-slate-900 font-bold text-lg flex items-center gap-2"><ApiOutlined className="text-slate-400" /> Repository & Sync Details</Text>}
            headStyle={{ borderBottom: '1px solid #f1f5f9', padding: '16px 32px', minHeight: 'auto' }}
          >
            <Row gutter={[32, 32]}>
              
              {/* Repository Information Grid */}
              <Col xs={24} lg={12} className="space-y-6">
                <div>
                  <Text className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-4">Metadata Overview</Text>
                  
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <Text className="text-slate-500 font-bold text-sm">Target Repository</Text>
                      <Text className="text-slate-900 font-bold">frontend-ecommerce</Text>
                    </div>
                    <Divider className="my-0 border-slate-200" />
                    <div className="flex justify-between items-center">
                      <Text className="text-slate-500 font-bold text-sm">Visibility Status</Text>
                      <Tooltip title="This repository is securely locked.">
                        <Tag className="m-0 bg-white border border-slate-200 text-slate-700 font-bold rounded flex items-center gap-1.5 px-2 py-0.5">
                          <LockOutlined className="text-slate-400" /> Private
                        </Tag>
                      </Tooltip>
                    </div>
                    <Divider className="my-0 border-slate-200" />
                    <div className="flex justify-between items-center">
                      <Text className="text-slate-500 font-bold text-sm">Default Branch</Text>
                      <Text className="text-slate-900 font-bold font-mono text-sm bg-white px-2 py-0.5 rounded border border-slate-200">main</Text>
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
                        <Title level={3} className="!text-slate-900 !m-0 leading-none">142</Title>
                        <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider">Total Commits</Text>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:border-blue-300 transition-colors cursor-default shadow-sm shadow-blue-900/5">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                        <UsergroupAddOutlined className="text-purple-600 text-lg" />
                      </div>
                      <div>
                        <Title level={3} className="!text-slate-900 !m-0 leading-none">3</Title>
                        <Text className="text-slate-500 font-bold text-xs uppercase tracking-wider">Contributors</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Automated Synchronization Section */}
              <Col xs={24} lg={12}>
                <div className="h-full bg-blue-100 border border-blue-300 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-md shadow-blue-900/10 relative overflow-hidden">
                  
                  {/* Decorative Background Icon */}
                  <GithubOutlined className="absolute -right-8 -bottom-8 text-blue-500 opacity-15 text-9xl transform -rotate-12 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <SyncOutlined className="text-blue-600 animate-spin-slow text-lg" />
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
                        <div className="w-4 h-4 rounded-full border-2 border-emerald-500 flex items-center justify-center p-[2px]">
                          <div className="w-full h-full rounded-full bg-emerald-500"></div>
                        </div>
                        <div>
                          <Text className="text-slate-900 font-bold block leading-tight">Payload Webhook</Text>
                          <Text className="text-slate-500 font-medium text-xs">Listening for push events</Text>
                        </div>
                      </div>
                      <Switch defaultChecked className="bg-emerald-500" />
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
