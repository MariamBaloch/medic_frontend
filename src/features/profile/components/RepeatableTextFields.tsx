import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import styled from "styled-components";

const FieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 8px;
  width: 100%;
`;

interface RepeatableTextFieldsProps {
  name: "allergies" | "chronicConditions";
  label: string;
  placeholder: string;
  addLabel: string;
  removeLabel: string;
}

export function RepeatableTextFields({
  name,
  label,
  placeholder,
  addLabel,
  removeLabel,
}: RepeatableTextFieldsProps) {
  return (
    <Form.Item label={label}>
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <FieldsList>
            {fields.map((field) => (
              <FieldRow key={field.key}>
                <Form.Item name={field.name} style={{ minWidth: 0, marginBottom: 0 }}>
                  <Input placeholder={placeholder} style={{ width: "100%" }} />
                </Form.Item>
                <Button
                  type="text"
                  danger
                  aria-label={removeLabel}
                  icon={<MinusCircleOutlined />}
                  onClick={() => remove(field.name)}
                />
              </FieldRow>
            ))}
            <FieldRow>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                style={{ width: "90%" }}
              >
                {addLabel}
              </Button>
            </FieldRow>
          </FieldsList>
        )}
      </Form.List>
    </Form.Item>
  );
}
