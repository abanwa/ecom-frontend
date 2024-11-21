import { createContext, useCallback, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

function ShopContextProvider({ children }) {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("uToken") ? localStorage.getItem("uToken") : ""
  );
  const [addingTocart, setAddingToCart] = useState(false);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  async function addToCart(itemId, size) {
    // This ToastNotification was called in our App.jsx pag at the top, that is why we can access it anywhere
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    // we will copy the object
    let cartData = structuredClone(cartItems); // deep copy
    // let cartData = { ...cartItems }; // shallow copy

    if (cartData[itemId]) {
      // check if that product has has size
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      // this creates an object base on the itemId
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);

    // we will add the cart here to database
    if (token) {
      try {
        setAddingToCart(true);
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          {
            headers: { token }
          }
        );
      } catch (err) {
        console.log("Error in addToCart in shopContext : ", err);
        toast.error(err?.message);
      } finally {
        setAddingToCart(false);
      }
    }
  }

  function getCartCount() {
    let totalCount = 0;
    for (const itemId in cartItems) {
      //   console.log("cartItems ", cartItems);
      for (const size in cartItems[itemId]) {
        // console.log("cartItem[items] ", cartItems[items]);
        // console.log("cartItem[items][item] ", cartItems[items][item]);
        try {
          if (cartItems[itemId][size] > 0) {
            totalCount += cartItems[itemId][size];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return totalCount;
  }

  async function updateQuantity(itemId, size, quantity) {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { size, quantity },
          { headers: { token } }
        );
      } catch (err) {
        console.log("Error in updateQuantity in shopContext : ", err);
        toast.error(err?.message);
      }
    }
  }

  const getUserCart = useCallback(
    async (token) => {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/cart/get`,
          {},
          {
            headers: { token }
          }
        );
        if (data?.success) {
          console.log("cartData gotten and set from backend");
          setCartItems(data?.cartData);
        } else {
          console.log("could not get and set cartData from backend");
          toast.error(data?.message);
        }
      } catch (err) {
        console.log("Error in getUserCart in shopContext : ", err);
        toast.error(err?.message);
      }
    },
    [backendUrl]
  );

  function getCartAmount() {
    // we will get the total amount of the cart
    let totalAmount = 0;
    for (const itemsId in cartItems) {
      let itemInfo = products.find((product) => product._id === itemsId);
      for (const size in cartItems[itemsId]) {
        try {
          if (cartItems[itemsId][size] > 0) {
            // we will muliple the price by the quantity
            totalAmount += itemInfo.price * cartItems[itemsId][size];
          }
        } catch (err) {
          console.log(
            "could not calculate anount in getCartAmount in shopContext"
          );
          console.log(err);
        }
      }
    }

    return totalAmount;
  }

  const getProductsData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/list`);
      if (data?.success) {
        console.log("products fetched in shopContext in getProductsData");
        setProducts(data?.products);
      } else {
        console.log(
          "could not fetch products in shopContext in getProductsData"
        );
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error in ShopContext in getProductsData : ", err);
      toast.error(err?.message);
    }
  }, [backendUrl]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    addingTocart
  };

  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  // get token
  useEffect(() => {
    if (!token && localStorage.getItem("uToken")) {
      setToken(localStorage.getItem("uToken"));
      getUserCart(localStorage.getItem("uToken"));
    }
  }, [getUserCart, token]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export default ShopContextProvider;
