import { ConfigProvider } from "antd";
import { ThemeProvider } from "styled-components";
import { AppRoutes } from "./routes/AppRoutes";
import { antdTheme } from "./theme/antdTheme";
import { styledTheme } from "./theme/styledTheme";

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <ThemeProvider theme={styledTheme}>
        <AppRoutes />
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
