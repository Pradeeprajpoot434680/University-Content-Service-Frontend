import { useLocation } from 'react-router-dom';
import App from '../App';
import Navbar from './Navbar';
import { ThemeProvider } from './theme-provider';
import { Toaster } from 'sonner';

export default function AppShell() {
  const { pathname } = useLocation();
  const hasMarketingNavigation = ['/', '/about-us', '/verify-account'].includes(pathname);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      {hasMarketingNavigation && <Navbar />}
      <App />
      <Toaster richColors closeButton />
    </ThemeProvider>
  );
}
