import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@components/layout';
import { Home } from '@pages/Home';
import { Commission } from '@pages/Commission';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/commission', element: <Commission /> },
    ],
  },
]);
