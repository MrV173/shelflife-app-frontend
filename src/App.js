import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import Products from "./pages/Products";
import RareProducts from "./pages/RareProducts";
import Shelflifes from "./pages/Shelflifes";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AddShelflife from "./pages/AddShelflife";
import AddRareProduct from "./pages/AddRareProduct";
import EditRareProduct from "./pages/EditRareProduct";
import UserHistoryShelflife from "./pages/UserHistoryShelflife";
import Categories from "./pages/Categories";
import ShelflifeRareProduct from "./pages/ShelflifeRareProduct";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/shelflifes" element={<Shelflifes />} />
          <Route path="/shelflifes/add" element={<AddShelflife />} />
          <Route
            path="/shelflifes/rare-product"
            element={<ShelflifeRareProduct />}
          />
          <Route
            path="/shelflifes/user-history"
            element={<UserHistoryShelflife />}
          />
          <Route path="/rare-products" element={<RareProducts />} />
          <Route path="/rare-products/add" element={<AddRareProduct />} />
          <Route path="/rare-products/edit/:id" element={<EditRareProduct />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
