import { useContext, useEffect, useState } from "react";
import useProducts from "../../../constants/products";
import ProductCard from "../Product";
import { Buffer } from "buffer";
import { Pagination, Stack } from "@mui/material";
import Loader3 from "../Loading3";
import { ThemeContext } from "../../../constants/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FavContext } from "../../../constants/favItems";
import { CartContext } from "../../../constants/cartItems";

const WomenShoes = () => {
  const { loading, products } = useProducts();
  const [Menpants, setMenpants] = useState([]);
  const { itemsOnCart, addItemOncart, deleteItem } = useContext(CartContext);
  const [localCart, setLocalCart] = useState([]);
  const [localFav, setLocalFav] = useState([]);
  const { itemsOnFav, addItemOnFav, deleteItemFromFav } =
    useContext(FavContext);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Menpants.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const totalPages = Math.ceil(Menpants.length / productsPerPage);

  useEffect(() => {
    const menProducts = products.filter(
      (prod) => prod.gender === "Female" && prod.category === "shoes" ||
      (prod.gender === "Both" && prod.category === "shoes")

    );
    setMenpants(menProducts);

    if (itemsOnCart && itemsOnCart.length > 0) {
      setLocalCart(itemsOnCart.map((item) => item.productId));
    } else {
      setLocalCart([]);
    }
    if (itemsOnFav && itemsOnFav.length > 0) {
      setLocalFav(itemsOnFav.map((items) => items.productId));
    } else {
      setLocalFav([]);
    }
  }, [products, itemsOnCart, itemsOnFav]);

  const handleAddToCart = (pantId, event) => {
    event.stopPropagation(); 
    addItemOncart(pantId);
    setLocalCart([...localCart, pantId]);
  };

  const handleDeleteItem = (pantId, event) => {
    event.stopPropagation(); 
    deleteItem(pantId);
    setLocalCart(localCart.filter((id) => id !== pantId));
  };

  const handleAddToFav = (pantId, event) => {
    event.stopPropagation();
    addItemOnFav(pantId);
    setLocalFav([...localFav, pantId]);
  };

  const handleDeleteFromFav = (pantId, event) => {
    event.stopPropagation();
    deleteItemFromFav(pantId);
    setLocalFav(localFav.filter((id) => id !== pantId));
  };

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function showProduct(itemId) {
    navigate(`/product/${itemId}`);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader3 />
      </div>
    );
  }

  return (
    <div>
      {Menpants.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {currentProducts.map((pant) => {
              const isOnCart = localCart.includes(pant._id);
              const isOnFav = localFav.includes(pant._id);

              return (
                <div key={pant._id} onClick={() => showProduct(pant._id)}>
                  <ProductCard
                    itemImage={`data:${
                      pant.image.contentType
                    };base64,${Buffer.from(pant.image.data).toString(
                      "base64"
                    )}`}
                    itemName={pant.name}
                    itemDesc={pant.description}
                    itemPrice={`RWF ${pant.price}`}
                    handleAddToCart={(event) =>
                      handleAddToCart(pant._id, event)
                    }
                    deleteItem={(event) => handleDeleteItem(pant._id, event)} // Pass event here
                    isOnCart={isOnCart}
                    isOnFav={isOnFav}
                    addToFav={(event) => handleAddToFav(pant._id, event)} // Pass event here
                    deleteFromFav={(event) =>
                      handleDeleteFromFav(pant._id, event)
                    }
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center">
              <Stack spacing={2} className="mt-5">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="circular"
                  siblingCount={1}
                  boundaryCount={2}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: theme == "dark" ? "#fff" : "#000",
                      borderColor: theme == "dark" ? "#fff" : "#000",
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: theme == "dark" ? "#fff" : "#000",
                      color: theme == "dark" ? "#000" : "#fff",
                    },
                    "& .MuiPaginationItem-ellipsis": {
                      color: theme == "dark" ? "#fff" : "#000",
                    },
                  }}
                />
              </Stack>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-black font-bold text-lg flex flex-col items-center justify-center dark:text-white">
          <img
            src="/noData.png"
            alt="No Data"
            className="w-[10rem] h-[10rem] rounded-md my-3"
          />
          <h1>No products available</h1>
        </div>
      )}
    </div>
  );
};

export default WomenShoes;