import { useCallback, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

function Verify() {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success") || "";
  const orderId = searchParams.get("orderId") || "";

  const verifyPayment = useCallback(async () => {
    try {
      if (!token) {
        return null;
      }
      const { data } = await axios.post(
        `${backendUrl}/api/order/verifyStripe`,
        { success, orderId },
        { headers: { token } }
      );

      if (data?.success) {
        setCartItems({});
        navigate("/orders");
      } else {
        navigate("/cart");
      }
    } catch (err) {
      console.log("Error in verifyPayment in Verify.jsx : ", err);
      toast.error(err?.message);
    }
  }, [backendUrl, navigate, orderId, setCartItems, success, token]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  return <div></div>;
}

export default Verify;
