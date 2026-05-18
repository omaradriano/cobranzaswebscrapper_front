import "./App.css";
import Header from "./components/header";
import GlobalStyle from "./styles/GlobalStyles";
import ContextProvider from "./Context/ContextProvider";
import Dashboard from "./components/dashboard";
import { useContext } from "react";
import { ThemeContext, type PreferedScheme } from "./Context/ContextConfig";
import AuthView from "./components/authview";
import { Route, Routes } from "react-router";
import Home from "./components/home";

function App() {
  return (
    <ContextProvider>
      <GlobalStyleWithTheme />
      <Header />
      {/* <Route path="Auth" element={<AuthView mode="SignIn" />}></Route> */}
      <Routes>
        <Route path="home" element={<Home/>}></Route>
        <Route path="auth/register" element={<AuthView mode="SignUp" />}></Route>
        <Route path="auth/signin" element={<AuthView mode="SignIn" />}></Route>
        <Route path="dashboard" element={<Dashboard />}></Route>
        <Route path="auth/setpassword" element={<AuthView mode="SetPassword"/>}></Route>
        <Route path="auth/registercompleted" element={<AuthView mode="RegisterCompleted"/>}></Route>
        <Route path="auth/resetpasswordinitflow" element={<AuthView mode="ResetPasswordInitFlow"/>}></Route>
        <Route path="auth/resetpasswordcompleted" element={<AuthView mode="ResetPasswordCompleted"/>}></Route>
        <Route path="auth/resetpasswordemailsended" element={<AuthView mode="ResetPasswordEmailSended"/>}></Route>
        <Route path="auth/loggedin" element={<AuthView mode="LoggedIn"/>}></Route>
        <Route path="auth/emailsended" element={<AuthView mode="EmailSended"/>}></Route>
        <Route path="auth/verifiedaccount" element={<AuthView mode="Verified"/>}></Route>
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
