import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Loading } from '@/components/common';
import { routes } from './routes';

const router = createBrowserRouter(routes);

export const AppRouter = () => (
  <Suspense fallback={<Loading fullscreen text="Đang tải..." />}>
    <RouterProvider router={router} />
  </Suspense>
);
