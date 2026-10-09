import { ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { LoginPage, RegisterPage } from "./features/auth";
import { antdTheme } from "./theme/antdTheme";
import { styledTheme } from "./theme/styledTheme";

function App() {
  const [isRegistering, setIsRegistering] = useState(() => window.location.hash === "#register");

  useEffect(() => {
    const syncAuthPage = () => {
      setIsRegistering(window.location.hash === "#register");
    };

    window.addEventListener("hashchange", syncAuthPage);
    return () => window.removeEventListener("hashchange", syncAuthPage);
  }, []);

  return (
    <ConfigProvider theme={antdTheme}>
      <ThemeProvider theme={styledTheme}>
        {isRegistering ? <RegisterPage /> : <LoginPage />}
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
