import { Typography } from "antd";

const { Title, Text } = Typography;

interface StepTitleProps {
  title: string;
  description: string;
}

export function StepTitle({ title, description }: StepTitleProps) {
  return (
    <>
      <Title level={4} style={{ marginBottom: 0, marginTop: 5 }}>
        {title}
      </Title>
      <Text type="secondary">{description}</Text>
    </>
  );
}
