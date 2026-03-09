import "./App.css";
import Header from "./components/header";
import GlobalStyle from "./styles/GlobalStyles";
import ContextProvider from "./Context/ContextProvider";
import Dashboard from "./components/dashboard";
import { useContext } from "react";
import { ThemeContext, type PreferedScheme } from "./Context/ContextConfig";
import AuthView from "./components/authview";
import { Route, Routes } from "react-router";

function App() {
  return (
    <ContextProvider>
      <GlobalStyleWithTheme />
      <Header />
      {/* <Route path="Auth" element={<AuthView mode="SignIn" />}></Route> */}
      <Routes>
        <Route path="Auth" element={<AuthView mode="SignUp" />}></Route>
        <Route path="Dashboard" element={<Dashboard />}></Route>
      </Routes>
      {/* <AuthView /> */}
      {/* <Dashboard /> */}
    </ContextProvider>
  );
}

const GlobalStyleWithTheme = () => {
  const theme = useContext(ThemeContext);
  return <GlobalStyle $theme={(theme?.theme as PreferedScheme) ?? "Dark"} />;
};

export default App;
