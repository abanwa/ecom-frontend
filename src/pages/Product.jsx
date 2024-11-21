import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

function Product() {
  const { productId } = useParams();
  const { products, currency, addToCart, addingTocart } =
    useContext(ShopContext);

  // get the product based on the productId
  const [productData, setProductData] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [size, setSize] = useState(null);

  const fetchProductData = useCallback(
    async (productId) => {
      const itemFound = products.find((item) => item._id === productId);
      setProductData(itemFound);
      setCurrentImage(itemFound?.image[0]);
    },
    [products]
  );

  useEffect(() => {
    fetchProductData(productId);
  }, [fetchProductData, productId]);

  const IsproductDataAvailabel = !!productData;
  if (!productId || !products.length || !IsproductDataAvailabel) return null;
  // console.log(productData);
  const { image, name, price, description, sizes, _id, category, subCategory } =
    productData;

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* =========  Product Data ============ */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* ============ Product Images ============= */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto  justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {image.map((item) => (
              <img
                onClick={() => setCurrentImage(item)}
                src={item}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                key={item}
                alt={item}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={currentImage} className="w-full h-auto" alt="onePhoto" />
          </div>
        </div>

        {/* ============ Product Information ============ */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} className="w-3.5" alt="starOne" />
            <img src={assets.star_icon} className="w-3.5" alt="starOne" />
            <img src={assets.star_icon} className="w-3.5" alt="starOne" />
            <img src={assets.star_icon} className="w-3.5" alt="starOne" />
            <img src={assets.star_dull_icon} className="w-3.5" alt="starOne" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {sizes.map((item) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(_id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            disabled={addingTocart}
          >
            {addingTocart ? "Adding..." : "ADD TO CART"}
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>

      {/* =========== Description && Review Section =============== */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta
            accusamus qui recusandae minus iure commodi quam, reprehenderit id
            impedit ducimus asperiores ad! Eligendi repellendus ducimus eius
            inventore vitae quos ratione!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
            enim ullam omnis commodi! Eaque, molestias!
          </p>
        </div>
      </div>
      {/* ========== Display Related products =========== */}
      <RelatedProducts category={category} subCategory={subCategory} />
    </div>
  );
}

export default Product;
