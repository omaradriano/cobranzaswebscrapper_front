import "./App.css";
import Header from "./components/header";
import GlobalStyle from "./styles/GlobalStyles";
import ContextProvider from "./Context/ContextProvider";
import Dashboard from "./components/dashboard";
import { useContext } from "react";
import { ThemeContext, type PreferedScheme } from "./Context/ContextConfig";

function App() {
  return (
    <ContextProvider>
      <GlobalStyleWithTheme />
      <Header />
      <Dashboard />
    </ContextProvider>
  );
}

const GlobalStyleWithTheme = () => {
  const theme = useContext(ThemeContext);
  return <GlobalStyle $theme={(theme?.theme as PreferedScheme) ?? "Dark"} />;
};

export default App;
