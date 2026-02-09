import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@components/layout';
import { Home } from '@pages/Home';
import { Commission } from '@pages/Commission';
import { ProtectedRoute } from '@components/auth/ProtectedRoute';
import { AdminLayout } from '@pages/Admin/AdminLayout';
import { Login } from '@pages/Admin/Login';
import { GalleryManager } from '@pages/Admin/GalleryManager';
import { ContentEditor } from '@pages/Admin/ContentEditor';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
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
    ],
  },
]);
