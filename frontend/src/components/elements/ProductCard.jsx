export function ProductCard({ key, product, onSelect, onAddToCart }) {
  const addToCartDefault = (e) => {
    e.stopPropagation();
    onAddToCart();
  };

  return (
    <div
      className=" bg-white cursor-pointer rounded-lg overflow-hidden border"
      onClick={() => onSelect(product)}
      key={key}
    >
      <div className="relative">
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
        <div
          className="absolute -bottom-3 select-none cursor-pointer right-1 bg-white px-3 rounded-md border"
          onClick={(e) => addToCartDefault(e, product, product.weights[0])}
        >
          Add
        </div>
      </div>
      <div className="py-3 px-1 space-y-2">
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
          <div className="px-2 text-sm py-1 border rounded-md">
            {product.weights[0]}
          </div>
        </div>
      </div>
    </div>
  );
}
