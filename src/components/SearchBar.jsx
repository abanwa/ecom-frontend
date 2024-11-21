import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

function SearchBar() {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);

  // THIS WILL MAKE IT TO SHOW ONLY FOR THE PAGE IT WAS SET. IF WE NAVIGATE TO ANOTHER PAGE, THE SEARCH BAR WILL NOT SHOW UNLESS WE CLICK THE SEARCH ICON
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("collection") && showSearch) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location, showSearch]);

  // if the showSearch is false, the search bar will not show or be returned
  if (!showSearch || !visible) return null;
  return (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          type="text"
          className="flex-1 outline-none bg-inherit text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />
        <img src={assets.search_icon} alt="search icon2" />
      </div>
      <img
        src={assets.cross_icon}
        className="inline w-3 cursor-pointer"
        alt="cross icon"
        onClick={() => setShowSearch(false)}
      />
    </div>
  );
}

export default SearchBar;
