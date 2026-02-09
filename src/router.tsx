import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@components/layout';
import { Home } from '@pages/Home';
import { Products } from '@pages/Products';
import { About } from '@pages/About';
import { Contact } from '@pages/Contact';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/products', element: <Products /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
    ],
  },
]);
