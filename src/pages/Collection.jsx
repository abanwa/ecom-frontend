import { useCallback, useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

function Collection() {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // const [currentPage, setPage] = useState(1);

  // const numberOfPages = Math.ceil(Number(products.length / LIMIT));
  // console.log("no of pages ", numberOfPages);

  // console.log("products", products);

  // console.log("filterProducts", filterProducts);

  const applyFilter = useCallback(() => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    setFilterProducts(productsCopy);
  }, [category, products, search, showSearch, subCategory]);

  const sortProduct = useCallback(() => {
    // we will create a copy of the filtered product
    // let filterProductCopy = [...filterProducts];
    // if (filterProductCopy.length === 0) return;

    switch (sortType) {
      case "low-high":
        // setFilterProducts(filterProductCopy.sort((a, b) => a.price - b.price));
        setFilterProducts((prevFilterProduct) =>
          prevFilterProduct.slice().sort((a, b) => a.price - b.price)
        );
        break;
      case "high-low":
        // setFilterProducts(filterProductCopy.sort((a, b) => b.price - a.price));
        setFilterProducts((prevFilterProduct) =>
          prevFilterProduct.slice().sort((a, b) => b.price - a.price)
        );
        break;
      default:
        applyFilter();
        break;
    }
  }, [applyFilter, sortType]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, applyFilter]);

  useEffect(() => {
    sortProduct();
  }, [sortProduct]);

  function toggleCategory(e) {
    if (category.includes(e.target.value)) {
      setCategory((prevCat) =>
        prevCat.filter((item) => item !== e.target.value)
      );
    } else {
      setCategory((prevCat) => [...prevCat, e.target.value]);
    }
  }

  function toggleSubCategory(e) {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prevSubCat) =>
        prevSubCat.filter((item) => item !== e.target.value)
      );
    } else {
      setSubCategory((prevSubCat) => [...prevSubCat, e.target.value]);
    }
  }

  /*
  function applyFilter() {
    we will create a copy of all the products
    let productCopy = products.slice();
    if (category.length > 0) {
      productCopy = productCopy.filter((item) =>
        category.includes(item.category)
      );
    }
  }
  */

  // useEffect(() => {
  //   console.log(category);
  //   console.log(subCategory);
  // }, [category, subCategory]);

  /*
  const [searchParams, setSearchParams] = useSearchParams();
  const LIMIT = 12;
   const skip = (currentPage - 1) * LIMIT;
  const currentPage = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const noOfPages = Math.ceil(Number(products.length / LIMIT));


  function nextPage(){
    const next = currentPage === noOfPages ? currentPage : currentPage + 1;
    searchParams.set("page", next);
    setSearchParams(searchParams);
    
  }

  function prevPage(){
    const prev = currentPage === 1 ? currentPage : currentPage - 1;
    searchParams.set("page", prev);
    setSearchParams(searchParams);
  }

  */

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter((show) => !show)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS{" "}
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            alt="dropdown2"
          />
        </p>
        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Men"}
                onChange={toggleCategory}
              />{" "}
              Men
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Women"}
                onChange={toggleCategory}
              />{" "}
              Women
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Kids"}
                onChange={toggleCategory}
              />{" "}
              Kids
            </p>
          </div>
        </div>

        {/* SubCategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Topwear"}
                onChange={toggleSubCategory}
              />{" "}
              Top wear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Bottomwear"}
                onChange={toggleSubCategory}
              />{" "}
              Bottom wear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Winterwear"}
                onChange={toggleSubCategory}
              />{" "}
              Winter wear
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* Product Sort */}
          <select
            className="border-2 border-gray-300 text-sm px-2"
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item) => (
            <ProductItem product={item} key={item._id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Collection;
