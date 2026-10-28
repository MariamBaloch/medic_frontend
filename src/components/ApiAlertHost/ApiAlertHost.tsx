import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { dismissApiAlert, getCurrentApiAlert, subscribeToApiAlerts } from "@services/api/appAlerts";
import { ApiAlertRegion, StyledApiAlert } from "./ApiAlertHost.styles";
import { CloseOutlined } from "@ant-design/icons";

export function ApiAlertHost() {
  const [alert, setAlert] = useState(getCurrentApiAlert);
  const alertRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeToApiAlerts(setAlert), []);
  useEffect(() => {
    if (alert) {
      alertRegionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [alert]);

  return (
    <ApiAlertRegion ref={alertRegionRef}>
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
            ></Button>
          }
        />
      ) : null}
    </ApiAlertRegion>
  );
}
