import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthProvider";
import Categories from "./pages/Categories";
import EditCategory from "./pages/EditCategory";
import EditTransaction from "./pages/EditTransaction";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewCategory from "./pages/NewCategory";
import NewTransaction from "./pages/NewTransaction";
import SignUp from "./pages/SignUp";
import Transactions from "./pages/Transactions";

const queryClient = new QueryClient();

const ProtectedRoute = () => {
  const { currentUser } = useAuth();

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/new" element={<NewCategory />} />
              <Route path="/categories/:id" element={<EditCategory />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/:id" element={<EditTransaction />} />
              <Route path="/transactions/new" element={<NewTransaction />} />
            </Route>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
