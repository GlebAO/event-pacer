import React, { useContext, useState } from "react";

type AuthState = {
  phone: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  authenticated: boolean;
  confirmingPhone: boolean;
};

type AuthContextType = {
  authState: AuthState;
  isAuthenticated: () => boolean;
  setAuthInfo: (authState: AuthState) => void;
};

const AuthContext = React.createContext<AuthContextType>({
  authState: {
    phone: null,
    authenticated: false,
    confirmingPhone: false,
    accessToken: null,
    refreshToken: null
  },
  isAuthenticated: () => false,
  setAuthInfo: () => undefined,
});

const { Provider } = AuthContext;

const AuthProvider: React.FC = ({ children }) => {
  const phone = localStorage.getItem("phone");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const authenticated = localStorage.getItem("authenticated");
  const confirmingPhone = localStorage.getItem("confirmingPhone");

  const [authState, setAuthState] = useState<AuthState>({
    phone,
    accessToken,
    refreshToken,
    authenticated: Boolean(authenticated),
    confirmingPhone: Boolean(confirmingPhone),
  });

  const isAuthenticated = () =>
    authState.authenticated && !authState.confirmingPhone;

  const setAuthInfo = (authState: AuthState) => {
    const { phone, authenticated, confirmingPhone, accessToken, refreshToken } = authState;

    localStorage.setItem("phone", String(phone));
    if(accessToken) {
        localStorage.setItem("accessToken", accessToken);
    }
    if(refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
    }
    authenticated ? localStorage.setItem("authenticated", String(authenticated)) : localStorage.removeItem("authenticated")
    confirmingPhone ? localStorage.setItem("confirmingPhone", String(confirmingPhone)) : localStorage.removeItem("confirmingPhone")

    setAuthState(authState);
  };

  return (
    <Provider value={{ authState, isAuthenticated, setAuthInfo }}>
      {children}
    </Provider>
  );
};

const useAuthContext = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuthContext };
