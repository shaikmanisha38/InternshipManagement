"use client";
import React, { useState } from 'react';
import { Card, Typography, Menu, Switch, Select, Radio, Button, Input, Form, Divider, Space, Row, Col, Alert } from 'antd';
import { 
  SettingOutlined, 
  BellOutlined, 
  SafetyCertificateOutlined, 
  LogoutOutlined,
  GlobalOutlined,
  BgColorsOutlined,
  MailOutlined,
  MobileOutlined,
  KeyOutlined,
  SunOutlined,
  MoonOutlined,
  DesktopOutlined,
  QrcodeOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [themeMode, setThemeMode] = useState('system');

  const handleMenuClick = (e) => {
    if (e.key !== 'logout') {
      setActiveTab(e.key);
    }
  };

  const menuItems = [
    {
      key: 'general',
      icon: <SettingOutlined className="text-lg" />,
      label: <Text className="font-bold text-sm">General Settings</Text>,
      className: activeTab === 'general' ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' : 'text-slate-600',
    },
    {
      key: 'notifications',
      icon: <BellOutlined className="text-lg" />,
      label: <Text className="font-bold text-sm">Notifications</Text>,
      className: activeTab === 'notifications' ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' : 'text-slate-600',
    },
    {
      key: 'security',
      icon: <SafetyCertificateOutlined className="text-lg" />,
      label: <Text className="font-bold text-sm">Security & System</Text>,
      className: activeTab === 'security' ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' : 'text-slate-600',
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 bg-blue-50/50 min-h-full">
      <div className="mb-6">
        <Title level={2} className="!text-slate-900 !mb-2">System Settings</Title>
        <Text className="text-slate-700 font-medium text-base">Configure your workspace preferences, security controls, and notification streams.</Text>
      </div>

      <div className="max-w-6xl mx-auto">
        <Row gutter={[32, 32]}>
          
          {/* LEFT PANEL: SETTINGS CATEGORIES LIST */}
          <Col xs={24} lg={7} xl={6}>
            <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white h-full overflow-hidden"  styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' } }}>
              <div className="p-6 pb-2 border-b border-slate-100">
                <Text className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">Configuration Menu</Text>
              </div>

              <Menu
                mode="inline"
                selectedKeys={[activeTab]}
                onClick={handleMenuClick}
                items={menuItems}
                className="border-r-0 pt-2 flex-1 [&_.ant-menu-item]:rounded-none [&_.ant-menu-item]:m-0 [&_.ant-menu-item]:w-full [&_.ant-menu-item]:h-14 [&_.ant-menu-item-selected]:bg-blue-50/80 [&_.ant-menu-item-selected_.ant-typography]:text-blue-700"
              />

              {/* Bottom Anchor: Global Logout */}
              <div className="p-6 mt-auto bg-slate-50 border-t border-slate-100">
                <Button 
                  block 
                  size="large" 
                  icon={<LogoutOutlined />} 
                  className="rounded-xl border-rose-200 text-rose-600 font-bold hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-colors h-12 shadow-sm"
                >
                  Logout Securely
                </Button>
              </div>
            </Card>
          </Col>

          {/* RIGHT PANEL: ACTIVE CONFIGURATION VIEWS */}
          <Col xs={24} lg={17} xl={18}>
            <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white min-h-[500px]"  styles={{ body: { padding: '40px' } }}>

              {/* CATEGORY A: GENERAL SETTINGS */}
              {activeTab === 'general' && (
                <div className="animate-fade-in space-y-10">
                  <div>
                    <Title level={3} className="!text-slate-900 !mb-1 flex items-center gap-2"><SettingOutlined className="text-blue-500" /> General Preferences</Title>
                    <Text className="text-slate-500 font-medium">Manage your core interface and regional localization settings.</Text>
                  </div>
                  
                  <Divider className="border-slate-100 my-0" />

                  {/* Theme Control */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <Text className="text-slate-900 font-bold text-base block mb-1 flex items-center gap-2"><BgColorsOutlined className="text-slate-400" /> Interface Theme</Text>
                      <Text className="text-slate-500 text-sm">Select or customize your workspace color contrast profile.</Text>
                    </div>
                    <Radio.Group 
                      value={themeMode} 
                      onChange={(e) => setThemeMode(e.target.value)}
                      buttonStyle="solid" 
                      className="[&_.ant-radio-button-wrapper]:h-12 [&_.ant-radio-button-wrapper]:leading-[46px] [&_.ant-radio-button-wrapper]:px-6 [&_.ant-radio-button-wrapper-checked]:bg-blue-600 [&_.ant-radio-button-wrapper-checked]:border-blue-600"
                    >
                      <Radio.Button value="light" className="font-bold text-slate-600"><SunOutlined className="mr-2" />Light</Radio.Button>
                      <Radio.Button value="dark" className="font-bold text-slate-600"><MoonOutlined className="mr-2" />Dark</Radio.Button>
                      <Radio.Button value="system" className="font-bold text-slate-600"><DesktopOutlined className="mr-2" />System</Radio.Button>
                    </Radio.Group>
                  </div>

                  <Divider className="border-slate-100 my-0" />

                  {/* Language Selector */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <Text className="text-slate-900 font-bold text-base block mb-1 flex items-center gap-2"><GlobalOutlined className="text-slate-400" /> Regional Language</Text>
                      <Text className="text-slate-500 text-sm">Set your primary translation locale for the portal.</Text>
                    </div>
                    <Select 
                      defaultValue="en-US" 
                      className="w-full md:w-64 [&>.ant-select-selector]:h-12 [&>.ant-select-selector]:rounded-xl [&>.ant-select-selection-item]:leading-[46px] [&>.ant-select-selector]:border-slate-300 font-bold text-slate-700"
                    >
                      <Option value="en-US">🇺🇸 English (US)</Option>
                      <Option value="es-ES">🇪🇸 Spanish</Option>
                      <Option value="de-DE">🇩🇪 German</Option>
                      <Option value="fr-FR">🇫🇷 French</Option>
                    </Select>
                  </div>
                </div>
              )}

              {/* CATEGORY B: NOTIFICATIONS & EMAIL PREFERENCES */}
              {activeTab === 'notifications' && (
                <div className="animate-fade-in space-y-10">
                  <div>
                    <Title level={3} className="!text-slate-900 !mb-1 flex items-center gap-2"><BellOutlined className="text-amber-500" /> Notification Streams</Title>
                    <Text className="text-slate-500 font-medium">Control what alerts you receive and how they are delivered to you.</Text>
                  </div>
                  
                  <Divider className="border-slate-100 my-0" />

                  {/* System Notifications */}
                  <div className="flex justify-between items-start gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 mt-1 flex-shrink-0">
                        <MobileOutlined className="text-blue-600 text-lg" />
                      </div>
                      <div>
                        <Text className="text-slate-900 font-bold text-base block mb-1">Desktop Push Alerts</Text>
                        <Text className="text-slate-500 text-sm leading-relaxed block max-w-md">Receive real-time desktop announcements for new task unlocks, immediate deadline reminders, and system maintenance events.</Text>
                      </div>
                    </div>
                    <Switch defaultChecked className="bg-slate-300 [&.ant-switch-checked]:bg-emerald-500 mt-1" />
                  </div>

                  {/* Email Preferences List */}
                  <div>
                    <Text className="text-slate-900 font-bold text-base block mb-6 flex items-center gap-2"><MailOutlined className="text-slate-400" /> Direct Email Subscriptions</Text>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <div>
                          <Text className="text-slate-800 font-bold block">Weekly Assessment Summaries</Text>
                          <Text className="text-slate-500 text-sm">Detailed grading breakdowns delivered every Monday.</Text>
                        </div>
                        <Switch defaultChecked className="bg-slate-300 [&.ant-switch-checked]:bg-blue-600" />
                      </div>

                      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <div>
                          <Text className="text-slate-800 font-bold block">AI Review Updates</Text>
                          <Text className="text-slate-500 text-sm">Instant alerts when an AI reviewer completes parsing your submission.</Text>
                        </div>
                        <Switch defaultChecked className="bg-slate-300 [&.ant-switch-checked]:bg-blue-600" />
                      </div>

                      <div className="flex justify-between items-center pb-2">
                        <div>
                          <Text className="text-slate-800 font-bold block">Marketing & Platform News</Text>
                          <Text className="text-slate-500 text-sm">Updates on new features, internships, and platform changes.</Text>
                        </div>
                        <Switch className="bg-slate-300 [&.ant-switch-checked]:bg-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORY C: SECURITY & CREDENTIALS */}
              {activeTab === 'security' && (
                <div className="animate-fade-in space-y-10">
                  <div>
                    <Title level={3} className="!text-slate-900 !mb-1 flex items-center gap-2"><SafetyCertificateOutlined className="text-emerald-500" /> Security & Credentials</Title>
                    <Text className="text-slate-500 font-medium">Protect your workspace, update your password, and enable advanced security.</Text>
                  </div>
                  
                  <Divider className="border-slate-100 my-0" />

                  {/* Change Password Block */}
                  <div>
                    <Text className="text-slate-900 font-bold text-base block mb-6 flex items-center gap-2"><KeyOutlined className="text-slate-400" /> Password Management</Text>
                    
                    <div className="max-w-md space-y-5">
                      <div>
                        <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider block mb-2">Current Password</Text>
                        <Input.Password className="h-12 rounded-xl border-slate-300 bg-slate-50 focus:bg-white" placeholder="Enter current password" />
                      </div>
                      <div>
                        <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider block mb-2">New Password</Text>
                        <Input.Password className="h-12 rounded-xl border-slate-300 bg-slate-50 focus:bg-white" placeholder="Minimum 8 characters" />
                      </div>
                      <div>
                        <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider block mb-2">Confirm New Password</Text>
                        <Input.Password className="h-12 rounded-xl border-slate-300 bg-slate-50 focus:bg-white" placeholder="Retype new password" />
                      </div>
                      <div className="pt-2">
                        <Button type="primary" size="large" className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 rounded-xl font-bold px-8 h-12 text-white">
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Divider className="border-slate-100 my-0" />

                  {/* Two-Factor Authentication (2FA) */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <Text className="text-slate-900 font-bold text-base block flex items-center gap-2"><QrcodeOutlined className="text-slate-400" /> Two-Factor Authentication (2FA)</Text>
                        <Text className="text-slate-500 text-sm">Add an extra layer of security to your account.</Text>
                      </div>
                      <Switch 
                        checked={twoFactorEnabled} 
                        onChange={(checked) => setTwoFactorEnabled(checked)} 
                        className="bg-slate-300 [&.ant-switch-checked]:bg-emerald-500" 
                      />
                    </div>

                    {twoFactorEnabled && (
                      <div className="animate-fade-in-up">
                        <Alert
                          title={<Text className="font-bold text-blue-900">Verification Setup Required</Text>}
                          description={
                            <div className="mt-2 space-y-4">
                              <Text className="text-blue-800 text-sm block">To complete 2FA setup, you must bind your authenticator app (like Google Authenticator or Authy) to your portal account.</Text>
                              <div className="flex gap-4">
                                <div className="w-32 h-32 bg-white border border-blue-200 rounded-lg flex items-center justify-center shadow-sm">
                                  <QrcodeOutlined className="text-5xl text-blue-300" />
                                </div>
                                <div className="flex flex-col justify-center gap-3 flex-1">
                                  <div>
                                    <Text className="text-blue-900/60 font-bold text-[10px] uppercase tracking-wider block mb-1">Manual Setup Key</Text>
                                    <Text className="text-blue-900 font-mono font-bold bg-white px-3 py-1.5 rounded border border-blue-100 block w-max">ABCD-1234-EFGH-5678</Text>
                                  </div>
                                  <Button className="w-max rounded-lg border-blue-300 text-blue-700 font-bold hover:bg-white shadow-sm">Verify & Activate Token</Button>
                                </div>
                              </div>
                            </div>
                          }
                          type="info"
                          showIcon
                          className="rounded-xl border-blue-200 bg-blue-50/70 p-5 [&_.ant-alert-icon]:mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

            </Card>
          </Col>

        </Row>
      </div>
    </div>
  );
}

