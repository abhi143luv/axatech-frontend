import { Button, Checkbox } from '../common';

export default function ProductCard({ product, index = 0, selected = false, onToggle }) {
  const descriptionSnippet = product.shortDescription ||
    (product.description?.slice(0, 100) + (product.description?.length > 100 ? '…' : ''));

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden flex flex-col shadow-sm dark:shadow-none transition-all duration-300 hover:border-primary/30 dark:hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-none hover:-translate-y-1 animate-fadeInUpSlow"
      style={{ animationDelay: `${0.3 + index * 0.06}s` }}
    >
      <div className="absolute top-3 right-3 z-10">
        <Checkbox
          size="sm"
          aria-label="Select product"
          checked={selected}
          onChange={(e) => onToggle?.(product._id, e.target.checked)}
        />
      </div>
      {(product.images?.[0]) && (
        <div className="h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6 sm:p-7 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {product.name}
        </h3>
        <p className="flex-1 text-sm text-gray-500 dark:text-gray-400 mb-5 line-clamp-3 leading-relaxed">
          {descriptionSnippet}
        </p>
        <div className="flex flex-nowrap items-center gap-3">
          <Button
            size="sm"
            to={`/products/${product.slug}`}
            variant="outline"
            fullWidth={false}
            className="flex-1 min-w-0 text-center rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-primary/30 dark:hover:border-secondary/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
          >
            Details
          </Button>
          <Button
            size="sm"
            to="/contact"
            state={{ enquiryType: 'product', productIds: [product._id], productName: product.name }}
            variant="primary"
            fullWidth={false}
            className="flex-1 min-w-0 text-center rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 whitespace-nowrap"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
