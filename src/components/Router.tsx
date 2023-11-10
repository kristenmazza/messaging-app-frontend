import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import Login from './Login';
import Register from './Register';
import Home from './Home';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      //   errorElement: <Error />,
      children: [
        { index: true, element: <Home /> },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/register',
          element: <Register />,
        },
        // { path: '*', element: <Error /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
