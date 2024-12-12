import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}