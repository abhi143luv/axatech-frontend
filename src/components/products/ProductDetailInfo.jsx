import { Button } from '../common';

export default function ProductDetailInfo({ product }) {
  return (
    <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
      {product.category && (
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase text-secondary dark:text-accent mb-3">
          <span className="w-6 h-px bg-secondary/60 dark:bg-accent/60" aria-hidden />
          {product.category.name}
        </p>
      )}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
        {product.name}
      </h1>
      {product.shortDescription && (
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6">
          {product.shortDescription}
        </p>
      )}
      {product.description && (
        <div
          className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }}
        />
      )}
      <Button
        to="/contact"
        state={{ enquiryType: 'product', productIds: [product._id], productName: product.name }}
        variant="primary"
        fullWidth={false}
        className="rounded-xl hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 px-8 py-4"
      >
        Buy Now - Enquiry
      </Button>
    </div>
  );
}
