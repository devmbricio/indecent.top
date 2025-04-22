// components/ProductsCard.tsx
import React from "react";

interface ProductsCardProps {
  name: string;
  price: string;
  description: string;
  onPurchase: () => void;
}

const ProductsCard: React.FC<ProductsCardProps> = ({ name, price, description, onPurchase }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-gray-500">{description}</p>
      <p className="text-lg font-semibold mt-2">{price}</p>
      <button
        onClick={onPurchase}
        className="mt-4 px-4 py-2 bg-blue-500 text-[#ddc897] rounded-lg hover:bg-blue-600"
      >
        Comprar
      </button>
    </div>
  );
};

export default ProductsCard;
