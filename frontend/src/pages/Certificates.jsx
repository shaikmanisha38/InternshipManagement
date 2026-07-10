import React, { useState } from 'react';
import { Card, Typography, Button, Tag, Space, Row, Col, Modal, Tooltip, Divider } from 'antd';
import { 
  SafetyCertificateFilled, 
  CalendarOutlined, 
  TrophyOutlined, 
  DownloadOutlined, 
  EyeOutlined, 
  ShareAltOutlined,
  CheckCircleFilled,
  IdcardOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function Certificates() {
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);

  // Render Realistic Certificate Canvas Placeholder
  const CertificateCanvas = ({ isModal = false }) => (
    <div className={`relative w-full ${isModal ? 'aspect-[1.414/1]' : 'aspect-[1.414/1]'} bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] border-[12px] border-slate-100 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center p-8 text-center`}>
      {/* Decorative Border Accents */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-slate-300"></div>
      <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-slate-300"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-slate-300"></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-slate-300"></div>
      
      {/* Watermark Logo */}
      <SafetyCertificateFilled className="absolute text-9xl text-slate-200/50 opacity-20 pointer-events-none" />

      {/* Content Skeleton */}
      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-blue-100/50 flex items-center justify-center mb-6 border border-blue-200">
          <SafetyCertificateFilled className="text-4xl text-blue-600" />
        </div>
        
        <Title level={isModal ? 2 : 3} className="!text-slate-800 !font-serif !tracking-widest uppercase !mb-2">Certificate of Completion</Title>
        <Text className="text-slate-500 font-medium tracking-widest uppercase text-xs mb-8">This is proudly presented to</Text>
        
        <div className="w-full border-b border-slate-400 pb-2 mb-4">
          <Title level={isModal ? 1 : 2} className="!text-blue-900 !m-0 !font-serif italic">Jessica Chen</Title>
        </div>
        
        <Text className="text-slate-600 font-medium text-sm leading-relaxed max-w-md mx-auto mb-10">
          For successfully completing the comprehensive software engineering internship program, demonstrating exceptional technical proficiency and dedication.
        </Text>

        {/* Signature Skeleton */}
        <div className="w-full flex justify-between px-10 mt-auto">
          <div className="flex flex-col items-center">
            <div className="w-32 h-10 border-b border-slate-400 mb-2 flex items-end justify-center pb-1">
              <span className="font-serif text-slate-500 italic text-xl">Dr. Alan Turing</span>
            </div>
            <Text className="text-slate-500 text-xs font-bold uppercase">Program Director</Text>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-32 h-10 border-b border-slate-400 mb-2 flex items-end justify-center pb-1">
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center border-2 border-rose-300 absolute mt-[-20px]">
                <span className="text-rose-600 font-black text-xs rotate-[-15deg]">SEAL</span>
              </div>
            </div>
            <Text className="text-slate-500 text-xs font-bold uppercase">Official Verified</Text>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 bg-blue-50/50 min-h-full">
      <div className="mb-8">
        <Title level={2} className="!text-slate-900 !mb-2">Certificates & Credentials</Title>
        <Text className="text-slate-700 font-medium text-base">View, download, and share your officially verified achievements.</Text>
      </div>

      <Row gutter={[32, 32]}>
        
        {/* ZONE 1: CERTIFICATE DETAIL & CREDENTIAL CARD */}
        <Col xs={24} lg={10} xl={9}>
          <Card 
            className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white h-full relative overflow-hidden" 
            bodyStyle={{ padding: '40px 32px', display: 'flex', flexDirection: 'column' }}
          >
            {/* Background Decorative Accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full pointer-events-none"></div>

            <div className="relative z-10 flex-1">
              {/* Document Title */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center shadow-inner">
                  <IdcardOutlined className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Title level={3} className="!text-slate-900 !m-0">Internship Certificate</Title>
                    <Tooltip title="Officially Verified by Administration">
                      <CheckCircleFilled className="text-blue-500 text-xl drop-shadow-sm" />
                    </Tooltip>
                  </div>
                  <Tag className="m-0 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2 py-0.5 rounded flex items-center gap-1 w-max">
                    <CheckCircleFilled className="text-emerald-500" /> Credential Verified
                  </Tag>
                </div>
              </div>

              <Divider className="my-6 border-slate-100" />

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest block mb-2">Completion Date</Text>
                  <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-blue-500 text-lg" />
                    <Text className="text-slate-900 font-bold text-base">July 10, 2026</Text>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest block mb-2">Final Evaluation</Text>
                  <div className="flex items-center gap-2">
                    <TrophyOutlined className="text-amber-500 text-lg" />
                    <Tag className="m-0 bg-blue-50 border border-blue-200 text-blue-700 font-bold px-2 py-0.5 rounded text-sm">
                      84% Overall Grade
                    </Tag>
                  </div>
                </div>
              </div>

              <Paragraph className="text-slate-600 font-medium leading-relaxed mb-0">
                This credential verifies that you have successfully satisfied all required curriculum mandates, coding evaluations, and professional checkpoints.
              </Paragraph>
            </div>

            {/* Primary Action */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <Button 
                type="primary" 
                size="large" 
                icon={<DownloadOutlined />} 
                className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 shadow-md shadow-blue-600/20 rounded-xl h-14 font-bold text-white text-base transition-transform hover:-translate-y-0.5"
              >
                Download Certificate
              </Button>
            </div>
          </Card>
        </Col>

        {/* ZONE 2: INTERACTIVE CERTIFICATE PREVIEW ENGINE */}
        <Col xs={24} lg={14} xl={15}>
          <div className="flex flex-col gap-6 h-full">
            
            {/* Preview Canvas Window */}
            <div className="flex-1 rounded-2xl bg-slate-200/50 p-4 md:p-8 flex items-center justify-center border border-slate-200 shadow-inner relative group overflow-hidden">
              <div className="w-full max-w-3xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <CertificateCanvas />
              </div>
              
              {/* Overlay Hover Prompt */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<EyeOutlined />} 
                  onClick={() => setIsPreviewModalVisible(true)}
                  className="bg-white hover:bg-blue-50 border-0 text-blue-600 shadow-xl rounded-full h-12 px-8 font-bold"
                >
                  Expand Preview
                </Button>
              </div>
            </div>

            {/* Quick Action Floating Toolbar */}
            <Card className="rounded-2xl border-slate-200 shadow-sm shadow-blue-900/5 bg-white" bodyStyle={{ padding: '20px' }}>
              <div className="flex flex-wrap justify-between items-center gap-4">
                <Text className="text-slate-900 font-bold flex items-center gap-2">
                  <SafetyCertificateFilled className="text-blue-500 text-xl" /> Credential Options
                </Text>
                <Space size="middle" wrap>
                  <Button 
                    icon={<EyeOutlined />} 
                    onClick={() => setIsPreviewModalVisible(true)}
                    className="rounded-lg border-slate-200 text-slate-700 font-bold hover:text-blue-600 hover:border-blue-300"
                  >
                    View
                  </Button>
                  <Button 
                    icon={<DownloadOutlined />} 
                    className="rounded-lg border-slate-200 text-slate-700 font-bold hover:text-blue-600 hover:border-blue-300"
                  >
                    Save PDF
                  </Button>
                  <Button 
                    type="primary"
                    icon={<ShareAltOutlined />} 
                    className="rounded-lg bg-slate-900 hover:bg-slate-800 border-0 text-white font-bold shadow-md shadow-slate-900/20"
                  >
                    Share Credential
                  </Button>
                </Space>
              </div>
            </Card>

          </div>
        </Col>
      </Row>

      {/* Full-Screen Preview Modal */}
      <Modal
        title={null}
        visible={isPreviewModalVisible}
        onCancel={() => setIsPreviewModalVisible(false)}
        footer={null}
        width={1000}
        centered
        destroyOnClose
        className="[&_.ant-modal-content]:p-0 [&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:overflow-hidden [&_.ant-modal-close]:bg-white [&_.ant-modal-close]:rounded-full [&_.ant-modal-close]:m-4 [&_.ant-modal-close]:shadow-md"
      >
        <CertificateCanvas isModal={true} />
        <div className="bg-slate-900 p-4 flex justify-end gap-3">
          <Button onClick={() => setIsPreviewModalVisible(false)} className="rounded-lg border-slate-700 bg-transparent text-white hover:text-white hover:border-slate-500 font-bold">Close Preview</Button>
          <Button type="primary" icon={<DownloadOutlined />} className="bg-blue-600 hover:bg-blue-700 border-0 shadow-sm rounded-lg font-bold text-white">Download Final File</Button>
        </div>
      </Modal>

    </div>
  );
}
