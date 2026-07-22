import React from 'react';
import { Card, Form, Input, Button, Switch, Divider } from 'antd';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="p-4 md:p-8 space-y-6 bg-slate-50 min-h-full">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">General Settings</h1>
      
      <Card className="rounded-2xl border-slate-200 shadow-sm max-w-3xl">
        <Form layout="vertical" initialValues={{ companyName: 'CodeCraft Internships', theme: true }}>
          <Form.Item label="Company Name" name="companyName">
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Logo URL">
            <Input size="large" placeholder="https://example.com/logo.png" />
          </Form.Item>
          
          <Divider />
          <h3 className="font-bold mb-4 text-lg">Email Settings</h3>
          <Form.Item label="SMTP Server">
            <Input size="large" placeholder="smtp.gmail.com" />
          </Form.Item>
          <Form.Item label="Sender Email">
            <Input size="large" placeholder="noreply@codecraft.com" />
          </Form.Item>
          
          <Divider />
          <h3 className="font-bold mb-4 text-lg">System Preferences</h3>
          <div className="flex items-center justify-between mb-4">
            <span>Dark Theme Enabled (Default)</span>
            <Form.Item name="theme" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span>Strict Password Policy</span>
            <Switch defaultChecked />
          </div>

          <Divider />
          <Button type="primary" className="bg-blue-600" size="large" icon={<Save className="w-4 h-4"/>}>
            Save Settings
          </Button>
        </Form>
      </Card>
    </div>
  );
}