import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";

function ProtectedRoute({ children }) {
  const { token, navigate } = useContext(ShopContext);

  useEffect(
    function () {
      if (!token) navigate("/login");
    },
    [navigate, token]
  );

  return token ? children : null;
}

export default ProtectedRoute;
