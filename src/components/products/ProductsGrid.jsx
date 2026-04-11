import ProductCard from './ProductCard';
import { Loader } from '../common';

export default function ProductsGrid({
  products,
  loading,
  selectedProductIds = [],
  onToggleProduct,
}) {
  if (loading) {
    return <Loader className="min-h-[40vh]" />;
  }
  if (!products?.length) {
    return (
      <div className="text-center py-20 px-5 animate-fadeInUp">
        <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto">
          No products found. Try a different search or category.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {products.map((p, index) => (
        <ProductCard
          key={p._id}
          product={p}
          index={index}
          selected={selectedProductIds.includes(p._id)}
          onToggle={onToggleProduct}
        />
      ))}
    </div>
  );
}
