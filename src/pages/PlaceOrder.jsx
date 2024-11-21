import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

function PlaceOrder() {
  const [method, setMethod] = useState("cash");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products
  } = useContext(ShopContext);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // This will be used to execute razorpay payment
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order?.amount,
      currency: order?.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order?.id,
      receipt: order?.receipt,
      handler: async (response) => {
        console.log("response from initPay : ", response);
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyRazorpay`,
            response,
            { headers: { token } }
          );

          if (data?.success) {
            console.log("razorpay verification successful");
            setCartItems({});
            navigate("/orders");
          } else {
            console.log("razor pay verification failed");
            toast.error(data?.message);
          }
        } catch (err) {
          console.log("Error in init pay :", err);
          toast.error(err?.message);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setPlacingOrder(true);
      console.log("Place order");
      /*
      this is how the cartItem looks like
      [
        126twty233fd : [
        S:4,
        M:2
        ],
        1f2d6twyty233fd : [
        XL:1,
        L:6
        ],
      ]
      */

      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product?._id === items)
            );
            if (itemInfo) {
              console.log("itemInfo : ", itemInfo);
              // we will attach the size of the product we selected and quantity to the product we want to buy and push it to the orderItem array
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      switch (method) {
        // cash is the same as cash on delivery
        case "cash": {
          const { data } = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            { headers: { token } }
          );
          if (data?.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            console.log("order placing failed for cash method");
            toast.error(data?.message);
          }
          break;
        }

        case "stripe": {
          const { data } = await axios.post(
            `${backendUrl}/api/order/stripe`,
            orderData,
            { headers: { token } }
          );
          if (data?.success) {
            console.log("stripe successful");
            const { session_url } = data;
            window.location.replace(session_url);
          } else {
            console.log("order placing failed for stripe method");
            toast.error(data?.message);
          }
          break;
        }

        case "razorpay": {
          const { data } = await axios.post(
            `${backendUrl}/api/order/razorpay`,
            orderData,
            { headers: { token } }
          );
          if (data?.success) {
            console.log("razorpay successful : ", data?.order);
            initPay(data?.order);
          } else {
            console.log("order placing failed for razorpay method");
            toast.error(data?.message);
          }
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.log("Error placing order in PlaceOrder : ", err);
      toast.error(err?.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  const {
    firstName,
    lastName,
    email,
    street,
    city,
    state,
    zipcode,
    country,
    phone
  } = formData;

  // if cartItem is emtpy, it should take us back to home
  useEffect(() => {
    if (Object.keys(cartItems).length === 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]"
    >
      {/* ======= LEFT SIDE ======= */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            name="firstName"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            onChange={onChangeHandler}
            value={firstName}
            placeholder="First Name"
            disabled={placingOrder}
            required
          />
          <input
            type="text"
            name="lastName"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="Last Name"
            onChange={onChangeHandler}
            value={lastName}
            disabled={placingOrder}
            required
          />
        </div>
        <input
          type="email"
          name="email"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          onChange={onChangeHandler}
          value={email}
          disabled={placingOrder}
          placeholder="Email Address"
          required
        />
        <input
          type="text"
          name="street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          onChange={onChangeHandler}
          value={street}
          disabled={placingOrder}
          placeholder="Street"
          required
        />
        <div className="flex gap-3">
          <input
            type="text"
            name="city"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            onChange={onChangeHandler}
            value={city}
            disabled={placingOrder}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            onChange={onChangeHandler}
            value={state}
            disabled={placingOrder}
            placeholder="State"
            required
          />
        </div>
        <div className="flex gap-3">
          <input
            type="number"
            name="zipcode"
            min={0}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            onChange={onChangeHandler}
            value={zipcode}
            disabled={placingOrder}
            placeholder="Zipcode"
            required
          />
          <input
            type="text"
            name="country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="Country"
            onChange={onChangeHandler}
            value={country}
            disabled={placingOrder}
            required
          />
        </div>
        <input
          type="number"
          name="phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          min={0}
          onChange={onChangeHandler}
          value={phone}
          disabled={placingOrder}
          placeholder="Phone"
          required
        />
      </div>

      {/* =========== Right SIde ========== */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* ======= PAYMENT METHOD SELECTION ======= */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              onClick={placingOrder ? null : () => setMethod("stripe")}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-500" : ""
                }`}
              ></p>
              <img
                src={assets.stripe_logo}
                className="h-5 mx-4"
                alt="stripe logo"
              />
            </div>
            <div
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              onClick={placingOrder ? null : () => setMethod("razorPay")}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorPay" ? "bg-green-500" : ""
                }`}
              ></p>
              <img
                src={assets.razorpay_logo}
                className="h-5 mx-4"
                alt="razor logo"
              />
            </div>
            <div
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
              onClick={placingOrder ? null : () => setMethod("cash")}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cash" ? "bg-green-500" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
        </div>

        <div className="w-full text-end mt-8">
          <button
            type="submit"
            className="bg-black text-white px-16 py-3 text-sm"
            disabled={placingOrder}
          >
            {placingOrder ? "Placing Order..." : "PLACE ORDER"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
