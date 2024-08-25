/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import {
  Box,
  Button,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import useProducts from "../constants/products";

export default function ProductTable() {
  const { products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    name: "",
    description: "",
    price: "",
    gender: "",
    category: "",
    stock: "",
    sold: "",
    image: null,
    imageUrl: "",
  });
  const [preview, setPreview] = useState("");

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const categories = ["shoes", "shirts", "pants", "watches", "hats"];
  const genders = ["Male", "Female", "Both"];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [products, searchTerm]);

  const fetchProducts = () => {
    setFilteredProducts(products);
  };

  const handleSearch = () => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercasedFilter) ||
        product.description.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredProducts(filteredData);
  };

  const handleEdit = (product) => {
    setSelectedProduct({
      ...product,
      imageUrl: `data:${product.image.contentType};base64,${Buffer.from(
        product.image.data
      ).toString("base64")}`,
    });
    setPreview(
      `data:${product.image.contentType};base64,${Buffer.from(
        product.image.data
      ).toString("base64")}`
    );
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct({
      name: "",
      description: "",
      price: "",
      gender: "",
      category: "",
      stock: "",
      sold: "",
      image: null,
      imageUrl: "",
    });
    setPreview("");
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", selectedProduct.name);
    formData.append("description", selectedProduct.description);
    formData.append("price", selectedProduct.price);
    formData.append("gender", selectedProduct.gender);
    formData.append("category", selectedProduct.category);
    formData.append("stock", selectedProduct.stock);
    formData.append("sold", selectedProduct.sold);
    if (selectedProduct.image) {
      formData.append("image", selectedProduct.image);
    }

    try {
      if (selectedProduct._id) {
        await axios
          .put(
            `http://localhost:5000/products/${selectedProduct._id}`,
            formData
          )
          .then(() => {
            location.reload();
          })
          .catch((e) => console.log(e));
      } else {
        await axios
          .post("http://localhost:5000/addProduct", formData)
          .then(() => location.reload())
          .catch((e) => console.log(e));
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedProduct({ ...selectedProduct, image: file });
    setPreview(URL.createObjectURL(file));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <FaSearch />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: { xs: 2, sm: 0 },
            width: { xs: "100%", sm: "auto" },
            backgroundColor: isDarkMode
              ? theme.palette.background.default
              : theme.palette.background.paper,
            color: isDarkMode
              ? theme.palette.text.primary
              : theme.palette.text.secondary,
            "& .MuiInputBase-input": {
              color: isDarkMode
                ? theme.palette.text.primary
                : theme.palette.text.secondary,
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: isDarkMode
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              },
              "&:hover fieldset": {
                borderColor: isDarkMode
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              },
              "&.Mui-focused fieldset": {
                borderColor: isDarkMode
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          Add Product
        </Button>
      </Box>
      <Box
        sx={{ overflowX: "auto", "&::-webkit-scrollbar": { height: "8px" } }}
      >
        <TableContainer component={Paper} sx={{ minWidth: "600px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Sold</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <img
                        src={`data:${
                          product.image.contentType
                        };base64,${Buffer.from(product.image.data).toString(
                          "base64"
                        )}`}
                        alt={product.name}
                        style={{ width: "50px", height: "50px" }}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.sold}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.gender}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(product)}>
                        <FaEdit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(product._id)}>
                        <FaTrashAlt />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No products available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Product Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ ...modalStyle, width: { xs: "90%", sm: 400 } }}>
          <TextField
            label="Name"
            value={selectedProduct.name}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={selectedProduct.description}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                description: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            type="number"
            label="Stock"
            value={selectedProduct.stock}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                stock: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            type="number"
            label="Sold"
            value={selectedProduct.sold}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                sold: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            type="number"
            label="Price($)"
            value={selectedProduct.price}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                price: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              value={selectedProduct.gender}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  gender: e.target.value,
                })
              }
            >
              {genders.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedProduct.category}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  category: e.target.value,
                })
              }
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            component="label"
            fullWidth
            margin="normal"
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          {preview && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <img
                src={preview}
                alt="preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </Box>
          )}

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  overflowY: "scroll",
  height: "100vh",
};
