import { ConfigProvider } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import { AppRoutes } from "@routes/AppRoutes";
import { queryClient } from "@services/api/queryClient";
import { antdTheme } from "@theme/antdTheme";
import { styledTheme } from "@theme/styledTheme";
import { GlobalStyle } from "@theme/GlobalStyle";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme}>
        <ThemeProvider theme={styledTheme}>
          <GlobalStyle />
          <AppRoutes />
        </ThemeProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
