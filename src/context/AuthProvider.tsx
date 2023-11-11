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
  persist: boolean | undefined;
  setPersist: Dispatch<SetStateAction<boolean | undefined>>;
}

const AuthContext = createContext<IAuthContextProps>({
  auth: {},
  setAuth: () => {},
  persist: false,
  setPersist: () => {},
});

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [auth, setAuth] = useState({});

  const storedPersist = localStorage.getItem('persist');
  const initialPersist = storedPersist ? JSON.parse(storedPersist) : false;

  const [persist, setPersist] = useState(initialPersist);

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
