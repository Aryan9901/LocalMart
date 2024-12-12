import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { LoginForm } from '@/components/auth/LoginForm';
import { ProductList } from '@/components/products/ProductList';
import { Cart } from '@/components/cart/Cart';
import { Orders } from '@/components/orders/Orders';
import { Layout } from '@/components/layout/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<ProductList />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;