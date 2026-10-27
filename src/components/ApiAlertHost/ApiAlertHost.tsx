import { Button } from "antd";
import { useEffect, useState } from "react";
import { dismissApiAlert, getCurrentApiAlert, subscribeToApiAlerts } from "@services/api/appAlerts";
import { ApiAlertRegion, StyledApiAlert } from "./ApiAlertHost.styles";
import { CloseOutlined } from "@ant-design/icons";

export function ApiAlertHost() {
  const [alert, setAlert] = useState(getCurrentApiAlert);

  useEffect(() => subscribeToApiAlerts(setAlert), []);

  return (
    <ApiAlertRegion>
      {alert ? (
        <StyledApiAlert
          data-alert-type={alert.type}
          type={alert.type}
          title={alert.message}
          description={alert.description}
          showIcon
          action={
            <Button
              type="link"
              icon={<CloseOutlined />}
              onClick={() => dismissApiAlert(alert.id)}
            >
            </Button>
          }
        />
      ) : null}
    </ApiAlertRegion>
  );
}
