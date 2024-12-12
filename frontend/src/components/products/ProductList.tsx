import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductGrid } from './ProductGrid';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { ProductListSkeleton } from './ProductListSkeleton';

export function ProductList() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<{
    fruits: Product[];
    vegetables: Product[];
  }>({ fruits: [], vegetables: [] });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.list();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <ProductListSkeleton />;
  }

  return (
    <Tabs defaultValue="vegetables" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
        <TabsTrigger value="fruits">Fruits</TabsTrigger>
      </TabsList>
      <TabsContent value="vegetables">
        <ProductGrid products={products.vegetables} />
      </TabsContent>
      <TabsContent value="fruits">
        <ProductGrid products={products.fruits} />
      </TabsContent>
    </Tabs>
  );
}