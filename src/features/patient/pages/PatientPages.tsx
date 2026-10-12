import { Card, Empty, Space, Typography } from "antd";

const { Paragraph, Title } = Typography;

export function PatientAppointmentsPage() {
  return (
    <Card bordered={false} style={{ borderRadius: 18 }}>
      <Space direction="vertical" size="small">
        <Title level={3} style={{ margin: 0, fontFamily: "Georgia, serif" }}>
          Your appointments
        </Title>
        <Paragraph type="secondary">See what’s ahead and keep track of every visit.</Paragraph>
      </Space>
      <Empty description="Your appointments will appear here." style={{ padding: "48px 0" }} />
    </Card>
  );
}
