import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./Component/Layout";

import Login from "./Component/login";
import ProtectedRoute from "./Component/ProtectedRoute";
import PublicRoute from "./Component/PublicRoute";
import AddInventory from "./Pages/AddInventory";
import AddQuotation from "./Pages/AddQuotation";
import ArchitectRegistration from "./Pages/ArchitectRegistration";
import BrandManagement from "./Pages/BrandManagement";
import CategoryManagement from "./Pages/CategoryManagement";
import CustomerManagement from "./Pages/CustomerManagement";
import Dashboard from "./Pages/Dashboard";
import DeliveryChallan from "./Pages/DeliveryChallan";
import EmpDashboard from "./Pages/empdashboard";
import EmployeeAttendance from "./Pages/EmployeeAttendance";
import EmployeeRegistration from "./Pages/EmployeeRegistration";
import EmployeeRole from "./Pages/EmployeeRole";
import GenerateQuote from "./Pages/GenerateQuote";
import ManageInventory from "./Pages/ManageInventory";
import ManageQuotation from "./Pages/ManageQuotation";
import ProductRegistration from "./Pages/ProductRegistration";
import QualityManagement from "./Pages/QualityManagement";



export default function App() {
  return (
    <Router>
      <Routes>

        {/* 🔓 PUBLIC ROUTE (NO LAYOUT) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* 🔐 PROTECTED ROUTES (WITH LAYOUT) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
           <Route path="/employee/dashboard" element={<EmpDashboard />} />
          <Route path="product-registration" element={<ProductRegistration />} />
          <Route path="generate-quote" element={<GenerateQuote />} />
          <Route path="employee-registration" element={<EmployeeRegistration />} />
          <Route path="delivery-challan" element={<DeliveryChallan />} />
          <Route path="Customer-Management" element={<CustomerManagement />} />
          <Route path="Category-Management" element={<CategoryManagement />} />
          <Route path="Quality-Management" element={<QualityManagement />} />
          <Route path="Brand-Management" element={<BrandManagement />} />

          <Route path="inventory/add" element={<AddInventory />} />
          <Route path="inventory/manage" element={<ManageInventory />} />

          <Route path="quotation/add" element={<AddQuotation />} />
          <Route path="quotation/manage" element={<ManageQuotation />} />

          <Route path="employee-role" element={<EmployeeRole />} />
          <Route path="employee-attendance" element={<EmployeeAttendance />} />
          <Route path="Architect-Registration" element={<ArchitectRegistration />} />
        </Route>

      </Routes>
    </Router>
  );
}
