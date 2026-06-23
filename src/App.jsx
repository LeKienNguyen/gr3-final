import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { AppRouter } from '@/router';

const App = () => (
  <ToastProvider>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </ToastProvider>
);

export default App;
