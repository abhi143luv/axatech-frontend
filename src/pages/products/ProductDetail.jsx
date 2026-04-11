import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { ProductDetailMedia, ProductDetailInfo } from '../../components/products';
import { Button, Loader, PageMeta } from '../../components/common';
import { ChevronLeftIcon } from '../../components/icons';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.product(slug).then(setProduct).catch(() => setProduct(null)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <Loader className="min-h-screen" />;
  }
  if (!product) {
    return (
      <div className="max-w-[1200px] mx-auto px-5 py-16 text-center text-gray-600 dark:text-gray-400 space-y-4">
        <p>Product not found.</p>
        <Button
          to="/products"
          variant="outline"
          fullWidth={false}
          className="inline-flex items-center gap-2"
        >
          <ChevronLeftIcon className="text-lg" />
          Back to products
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={`${product.name} - Axatech Add-ons`} description={product.shortDescription || product.description} />

      <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="mb-6">
            <Button
              to="/products"
              variant="outline"
              size="sm"
              fullWidth={false}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary/40 dark:hover:border-secondary/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <ChevronLeftIcon className="text-lg" />
              Back to products
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <ProductDetailMedia product={product} />
            <ProductDetailInfo product={product} />
          </div>
        </div>
      </section>
    </>
  );
}
