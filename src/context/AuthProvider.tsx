import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react';

interface IAuthProviderProps {
  children: ReactNode;
}

interface IAuthContextProps {
  auth: {
    email?: string;
    password?: string;
    accessToken?: string;
  };
  setAuth: Dispatch<
    SetStateAction<{ email?: string; password?: string; accessToken?: string }>
  >;
}

const AuthContext = createContext<IAuthContextProps>({
  auth: {},
  setAuth: () => {},
});

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [auth, setAuth] = useState({});
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
