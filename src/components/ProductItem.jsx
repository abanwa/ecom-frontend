import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

function ProductItem({ product }) {
  const { currency } = useContext(ShopContext);
  // checking if an obect is empty
  //   if (!Object.keys(product).length) return null;
  // checking if an obejct is truety or falsy
  const isProductAvailable = !!product;
  if (!isProductAvailable) return null;

  const { _id, image, name, price } = product;

  return (
    <Link to={`/product/${_id}`} className="text-gray-700 cursor-pointer">
      <div className="overflow-hidden">
        <img
          src={image[0]}
          className="hover:scale-110 transition ease-in-out"
          alt={`product ${_id}`}
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>
    </Link>
  );
}

export default ProductItem;
