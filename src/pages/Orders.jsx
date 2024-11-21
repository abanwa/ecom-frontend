import { useCallback, useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

function Orders() {
  const [orderData, setOrderData] = useState([]);
  // This will come from the orders we placed
  const { currency, token, backendUrl } = useContext(ShopContext);

  const loadOrderData = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (data?.success) {
        console.log("orders fetched in getUserOrder in Orders.jsx ");
        setOrderData(data?.orders);
        let allOrdersItem = [];
        data?.orders.map((order) => {
          order?.items.map((item) => {
            item["status"] = order?.status;
            item["payment"] = order?.payment;
            item["paymentMethod"] = order?.paymentMethod;
            item["date"] = order?.date;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      } else {
        console.log("orders failed to fetched in getUserOrder in Orders.jsx ");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error in getUserOrder in Orders.jsx : ", err);
      toast.error(err?.message);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    if (token) {
      loadOrderData();
    }
  }, [loadOrderData, token]);

  console.log("oreders : ", orderData);
  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div
            key={`${item._id}_${index}`}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img
                src={item.image[0]}
                className="w-16 sm:w-20"
                alt={`order ${item._id}`}
              />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                  <p>
                    {currency}
                    {item.price}
                  </p>
                  <p>Quantity: {item?.quantity}</p>
                  <p>Size: {item?.size}</p>
                </div>
                <p className="mt-1">
                  Date:{" "}
                  <span className="text-gray-400">
                    {new Date(item?.date).toDateString()}
                  </span>
                </p>
                <p className="mt-1">
                  Payment:
                  <span className="text-gray-400">{item?.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{item?.status}</p>
              </div>
              <button
                onClick={loadOrderData}
                className="border px-4 py-2 text-sm font-medium rounded"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
