import { useContext, useEffect, useState } from "react";
import useProducts from "../../../constants/products";
import ProductCard from "../Product";
import { Buffer } from "buffer";
import { CartContext } from "../../../constants/cartItems";
import { FavContext } from "../../../constants/favItems";
import Loader from "../loader";
import { Pagination, Stack } from "@mui/material";

const MenShoes = () => {
  const { loading, products } = useProducts();
  const [Menshoes, setMenshoes] = useState([]);
  const { itemsOnCart, addItemOncart, deleteItem } = useContext(CartContext);
  const [localCart, setLocalCart] = useState([]);
  const [localFav, setLocalFav] = useState([]);
  const { itemsOnFav, addItemOnFav, deleteItemFromFav } =
    useContext(FavContext);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Menshoes.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(Menshoes.length / productsPerPage);
  useEffect(() => {
    const menProducts = products.filter(
      (prod) => prod.gender == "Male" && prod.category == "shoes" ||
      (prod.gender === "Both" && prod.category === "shoes")

    );
    setMenshoes(menProducts);

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

  const handleAddToCart = (shoeId) => {
    addItemOncart(shoeId);
    setLocalCart([...localCart, shoeId]);
  };

  const handleDeleteItem = (shoeId) => {
    deleteItem(shoeId);
    setLocalCart(localCart.filter((id) => id !== shoeId));
  };

  const handleAddToFav = (shoeId) => {
    addItemOnFav(shoeId);
    setLocalFav([...localFav, shoeId]);
  };

  const handleDeleteFromFav = (shoeId) => {
    deleteItemFromFav(shoeId);
    setLocalFav(localFav.filter((id) => id !== shoeId));
  };
  function handlePageChange(event, pageNumber) {
    setCurrentPage(pageNumber);
  }
  if (loading) {
    return <Loader text="Loading products ..." />;
  }

  return (
    <div>
      {Menshoes.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {currentProducts.map((shoe) => {
              const isOnCart = localCart.includes(shoe._id);
              const isOnFav = localFav.includes(shoe._id);

              return (
                <div key={shoe._id}>
                  <ProductCard
                    itemImage={`data:${
                      shoe.image.contentType
                    };base64,${Buffer.from(shoe.image.data).toString(
                      "base64"
                    )}`}
                    itemName={shoe.name}
                    itemDesc={shoe.description}
                    itemPrice={`RWF ${shoe.price}`}
                    handleAddToCart={() => handleAddToCart(shoe._id)}
                    deleteItem={() => handleDeleteItem(shoe._id)}
                    isOnCart={isOnCart}
                    isOnFav={isOnFav}
                    addToFav={() => handleAddToFav(shoe._id)}
                    deleteFromFav={() => handleDeleteFromFav(shoe._id)}
                  />
                </div>
              );
            })}
          </div>
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
              />
            </Stack>
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

export default MenShoes;
