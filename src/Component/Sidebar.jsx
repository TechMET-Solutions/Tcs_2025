import {
  BadgeCheck,
  ChevronDown,
  ChevronRight,
  DraftingCompass,
  FileChartColumn,
  FilePlus,
  FileSignature,
  FileText,
  Grid2X2,
  Layers,
  LayoutDashboard,
  ListChecks,
  Menu,
  NotebookPen,
  Package,
  PlusCircle,
  Tag,
  Truck,
  UserPlus,
  Users,
  WalletCards
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.png";
import { useAuth } from "../utils/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Destructuring permissions, user, and loading from your AuthContext
  const { permissions, user, loading, role } = useAuth(); 
  console.log(role,"role")
  const [open, setOpen] = useState(true);
  const [openInventory, setOpenInventory] = useState(false);
  const [openQuotation, setOpenQuotation] = useState(false);

  const isActive = (path) => location.pathname === path;

  /**
   * Helper to check permissions.
   * Logic: If role is 'admin' or 'superadmin', return true immediately.
   * Otherwise, check the specific permission key from state.
   */
  const hasView = (key) => {
    if (loading) return false; 
    
    // ADMIN & SUPERADMIN BYPASS: Show all menu items
    if (role === "admin" || role === "superadmin") {
      return true;
    }
    
    // EMPLOYEE CHECK: Check the specific state permissions
    return permissions && permissions[`${key}_View`] === true;
  };

  /**
   * Helper Component for individual Sidebar links to keep the main return clean
   */
  const NavItem = ({ label, icon, path, isSubItem = false }) => (
    <div
      onClick={() => navigate(path)}
      className={`flex items-center gap-4 cursor-pointer rounded-xl mb-1 transition-all duration-200
        ${isSubItem ? "py-2 px-3" : "p-3"}
        ${isActive(path)
          ? "bg-orange-500 text-white shadow-lg"
          : "text-gray-300 hover:bg-orange-500/20 hover:text-white"
        } ${!open ? "justify-center" : ""}`}
    >
      <span className={`${isSubItem ? "text-base" : "text-lg"} ${!open ? "scale-110" : ""}`}>
        {icon}
      </span>
      {open && <span className="text-sm font-medium">{label}</span>}
    </div>
  );

  // Show a loading skeleton while permissions are being fetched into state
  if (loading) {
    return <div className="h-screen w-20 bg-[#1E1E1E] animate-pulse" />;
  }

  return (
    <div className={`h-screen ${open ? "w-72 rounded-tr-[50px] rounded-br-[50px]" : "w-20"} 
      bg-[#1E1E1E] border-r border-black/30 shadow-xl flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}>
      
      {/* HEADER / LOGO */}
      <div className="flex items-center justify-between p-5 min-h-[80px]">
        {open ? (
          <img src={LOGO} alt="logo" className="w-[75%] transition-all duration-300 opacity-100" />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center mx-auto">
            <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-orange-500/20 text-white"
        >
          <Menu />
        </button>
      </div>

      {/* SCROLLABLE MENU AREA */}
      <div className="flex-1 overflow-y-auto sidebar-scroll px-3 pt-4">
        
        {/* DASHBOARD - Usually visible to all */}
        <NavItem label="Dashboard" icon={<LayoutDashboard />} path="/" />

        {/* TOP LEVEL PERMISSION-BASED ITEMS */}
        {hasView("Customer Management") && (
          <NavItem label="Customer Management" icon={<Users />} path="/Customer-Management" />
        )}

        {hasView("Employee Registration") && (
          <NavItem label="Employee Registration" icon={<UserPlus />} path="/employee-registration" />
        )}

        {hasView("Quality Management") && (
          <NavItem label="Quality Management" icon={<BadgeCheck />} path="/Quality-Management" />
        )}

        {hasView("Category Management") && (
          <NavItem label="Category Management" icon={<Grid2X2 />} path="/Category-Management" />
        )}

        {hasView("Brand Management") && (
          <NavItem label="Brand Management" icon={<Tag />} path="/Brand-Management" />
        )}

        {hasView("Product Registration") && (
          <NavItem label="Product Registration" icon={<Package />} path="/product-registration" />
        )}

        {/* ARCHITECT REGISTRATION - Now visible to Admin/Superadmin bypass */}
        {hasView("Architect Registration") && role !== "admin" && (
          <NavItem label="Architect Registration" icon={<DraftingCompass />} path="/Architect-Registration" />
        )}

        {/* INVENTORY SECTION WITH DROPDOWN */}
        {hasView("Inventory Management") && (
          <div className="mt-2">
            <div 
              onClick={() => setOpenInventory(!openInventory)} 
              className={`flex items-center ${open ? "justify-between" : "justify-center"} p-3 cursor-pointer rounded-xl text-gray-300 hover:bg-orange-500/20 hover:text-white transition-all`}
            >
              <div className="flex items-center gap-4">
                <Layers />
                {open && <span className="text-sm font-medium">Inventory</span>}
              </div>
              {open && (openInventory ? <ChevronDown size={18}/> : <ChevronRight size={18}/>)}
            </div>
            {openInventory && open && (
              <div className="ml-8 mt-2 flex flex-col gap-1 border-l border-gray-600 pl-4 animate-in slide-in-from-top-2 duration-200">
                {/* Specific Check for Adding Inventory */}
                {(user?.role === "admin" || user?.role === "superadmin" || permissions?.["Inventory Management_Add"]) && (
                   <NavItem label="Add Inventory" icon={<PlusCircle size={16} />} path="/inventory/add" isSubItem />
                )}
                <NavItem label="Manage Inventory" icon={<ListChecks size={16} />} path="/inventory/manage" isSubItem />
              </div>
            )}
          </div>
        )}

        {/* QUOTATION SECTION WITH DROPDOWN */}
        {hasView("Quotation Management") && (
          <div className="mt-2">
            <div 
              onClick={() => setOpenQuotation(!openQuotation)} 
              className={`flex items-center ${open ? "justify-between" : "justify-center"} p-3 cursor-pointer rounded-xl text-gray-300 hover:bg-orange-500/20 hover:text-white transition-all`}
            >
              <div className="flex items-center gap-4">
                <FileSignature />
                {open && <span className="text-sm font-medium">Quotation</span>}
              </div>
              {open && (openQuotation ? <ChevronDown size={18}/> : <ChevronRight size={18}/>)}
            </div>
            {openQuotation && open && (
              <div className="ml-8 mt-2 flex flex-col gap-1 border-l border-gray-600 pl-4 animate-in slide-in-from-top-2 duration-200">
                {/* Specific Check for Adding Quotations */}
                {(user?.role === "admin" || user?.role === "superadmin" || permissions?.["Quotation Management_Add"]) && (
                  <NavItem label="Add Quotation" icon={<FilePlus size={16} />} path="/quotation/add" isSubItem />
                )}
                <NavItem label="Manage Quotation" icon={<FileText size={16} />} path="/quotation/manage" isSubItem />
              </div>
            )}
          </div>
        )}

        {/* BOTTOM MENU SECTION */}
        <div className="mt-4 pt-4 border-t border-white/10">
          {hasView("Delivery Challans") && (
            <NavItem label="Delivery Challan" icon={<Truck />} path="/delivery-challan" />
          )}
          <NavItem label="Reports" icon={<FileChartColumn />} path="/report" />
          <NavItem label="Order Book" icon={<NotebookPen />} path="/orderbook" />
          <NavItem label="Payment History" icon={<WalletCards />} path="/payment-history" />
        </div>
      </div>

      {/* CUSTOM SCROLLBAR STYLING */}
      <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #666; }
      `}</style>
    </div>
  );
}