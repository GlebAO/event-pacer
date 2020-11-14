import React, { useContext, useState } from "react";

type AuthState = {
  phone: string | null;
  authenticated: boolean;
  confirmingPhone: boolean;
  accessToken?: string | null;
  refreshToken?: string | null;
  nextSendAfterSec?: number | null;
};

type AuthContextType = {
  authState: AuthState;
  isAuthenticated: () => boolean;
  setAuthInfo: (authState: AuthState) => void;
  setNextSend: (sec: number) => void;
  onLoginFail: () => void;
  onLoginSuccess: (accessToken: string, refreshToken:string) => void;
};

const AuthContext = React.createContext<AuthContextType>({
  authState: {
    phone: null,
    authenticated: false,
    confirmingPhone: false,
    accessToken: null,
    refreshToken: null,
    nextSendAfterSec: 0,
  },
  isAuthenticated: () => false,
  setAuthInfo: () => undefined,
  setNextSend: () => undefined,
  onLoginFail: () => undefined,
  onLoginSuccess: () => undefined,
});

const { Provider } = AuthContext;

const AuthProvider: React.FC = ({ children }) => {
  const phone = localStorage.getItem("phone");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const authenticated = localStorage.getItem("authenticated");
  const confirmingPhone = localStorage.getItem("confirmingPhone");
  const nextSendAfterSec = localStorage.getItem("nextSendAfterSec");

  const [authState, setAuthState] = useState<AuthState>({
    phone,
    accessToken,
    refreshToken,
    authenticated: Boolean(authenticated),
    confirmingPhone: Boolean(confirmingPhone),
    nextSendAfterSec: nextSendAfterSec ? +nextSendAfterSec : 0,
  });

  const isAuthenticated = () =>
    Boolean(authState.accessToken) &&
    authState.authenticated &&
    !authState.confirmingPhone;

  const setNextSend = (sec: number) => {
    localStorage.setItem("nextSendAfterSec", sec.toString());
    setAuthState({ ...authState, nextSendAfterSec: sec });
  };

  const setAuthInfo = (authState: AuthState) => {
    const {
      phone,
      authenticated,
      confirmingPhone,
      accessToken,
      refreshToken,
      nextSendAfterSec,
    } = authState;

    localStorage.setItem("phone", String(phone));

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    if (nextSendAfterSec) {
      localStorage.setItem("nextSendAfterSec", nextSendAfterSec.toString());
    }

    authenticated
      ? localStorage.setItem("authenticated", String(authenticated))
      : localStorage.removeItem("authenticated");

    confirmingPhone
      ? localStorage.setItem("confirmingPhone", String(confirmingPhone))
      : localStorage.removeItem("confirmingPhone");

    setAuthState(authState);
  };

  function onLoginSuccess(accessToken: string, refreshToken:string) {
    setAuthInfo({
      authenticated: true,
      confirmingPhone: false,
      phone: phone,
      accessToken,
      refreshToken,
    });
  }

  function onLoginFail() {
    setAuthInfo({
      authenticated: false,
      confirmingPhone: false,
      phone: null,
    });
  }

  return (
    <Provider value={{ authState, isAuthenticated, setAuthInfo, setNextSend, onLoginSuccess, onLoginFail }}>
      {children}
    </Provider>
  );
};

const useAuthContext = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuthContext };
