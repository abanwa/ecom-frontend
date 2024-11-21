import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

function Cart() {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      // loop for the product id that we used to created an object
      for (const items in cartItems) {
        // loop for that object that was created base on the product id
        for (const item in cartItems[items]) {
          // to access the size e.g cart[aaa][M] or cart[aaa][XL] as the case may be // to access the size
          // This is the reason why if the quantity is zero, it will be removed from our cartItem
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item] // we will get the quantity of this product for this particular size
            });
          }
        }
      }

      setCartData(tempData);
    }
  }, [cartItems, products.length]);

  // get all the products base on the cartData id
  const productData = cartData.map((itemData) => {
    const foundProduct = products.find((prod) => prod._id === itemData._id);
    if (foundProduct) {
      return {
        ...foundProduct,
        size: itemData.size,
        quantity: itemData.quantity
      };
    }
    return null; // handle case where product is not found
  });

  if (!productData.length) return null;

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div>
        {productData.map((product, index) => (
          <div
            className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_2fr_0.5fr] items-center"
            key={`${product._id}${product.size}_${index + 1}`}
          >
            <div className="flex items-start gap-6">
              <img
                src={product.image[0]}
                className="w-16 sm:w-20"
                alt={product.name}
              />
              <div>
                <p className="text-xs sm:text-lg font-medium">{product.name}</p>
                <div className="flex items-center gap-5 mt-2">
                  <p>
                    {currency}
                    {product.price}
                  </p>
                  <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                    {product.size}
                  </p>
                </div>
              </div>
            </div>
            <input
              type="number"
              onChange={(e) =>
                !e.target.value
                  ? null
                  : updateQuantity(
                      product._id,
                      product.size,
                      Number(e.target.value)
                    )
              }
              className="border max-w-10 sm:max-w-20 px-1  sm:px-2"
              min={1}
              defaultValue={product.quantity}
            />
            <img
              src={assets.bin_icon}
              onClick={() => updateQuantity(product._id, product.size, 0)}
              className="w-4 mr-4 sm:w-5 cursor-pointer"
              alt="bin_icon"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
