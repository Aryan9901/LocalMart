import { Button } from "@/components/ui/button";

export function ProductCard({ product, onSelect }) {
  return (
    <div className="relative bg-white rounded-lg overflow-hidden border">
      {product.discount > 0 && (
        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          {product.discount}% OFF
        </div>
      )}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-3 space-y-2">
        <h3 className="font-medium text-sm">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <select
            defaultValue={product.defaultWeight}
            className="w-24 h-8 text-xs border rounded-md px-2"
          >
            {product.weights.map((weight) => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>
        <Button
          onClick={() => onSelect(product)}
          variant="outline"
          className="w-full h-8 text-sm"
        >
          Add
        </Button>
      </div>
    </div>
  );
}
