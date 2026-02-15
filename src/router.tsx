import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@components/layout';
import { Home } from '@pages/Home';
import { Commission } from '@pages/Commission';
import { ProtectedRoute } from '@components/auth/ProtectedRoute';
import { AdminLayout } from '@pages/Admin/AdminLayout';
import { Login } from '@pages/Admin/Login';
import { GalleryManager } from '@pages/Admin/GalleryManager';
import { ContentEditor } from '@pages/Admin/ContentEditor';
import { CommissionEditor } from '@pages/Admin/CommissionEditor';
import { AboutEditor } from '@pages/Admin/AboutEditor';
import { PastWorksEditor } from '@pages/Admin/PastWorksEditor';
import { About } from '@pages/About';
import { PastWorks } from '@pages/PastWorks';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/past-works', element: <PastWorks /> },
      { path: '/commission', element: <Commission /> },
    ],
  },
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <GalleryManager /> },
      { path: 'content', element: <ContentEditor /> },
      { path: 'commissions', element: <CommissionEditor /> },
      { path: 'about', element: <AboutEditor /> },
      { path: 'past-works', element: <PastWorksEditor /> },
    ],
  },
]);
