import {
  BadgeCheck, ChevronDown, ChevronRight, DraftingCompass, FileChartColumn,
  FilePlus, FileSignature, FileText, Grid2X2, Layers, LayoutDashboard,
  ListChecks,
  NotebookPen, Package, PlusCircle, Tag, Truck, UserPlus, Users, WalletCards
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";



export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Destructure 'loading' or similar if your AuthContext provides it
  const { permissions, user, loading } = useAuth(); 
  
  const [open, setOpen] = useState(true);
  const [openInventory, setOpenInventory] = useState(false);
  const [openQuotation, setOpenQuotation] = useState(false);

  const isActive = (path) => location.pathname === path;
console.log(permissions,"permissions")
  // Improved Helper to check View permissions
  const hasView = (key) => {
    // 1. If still loading permissions, don't hide everything yet (optional)
    if (loading) return false; 
    
    // 2. Superadmin bypass
    if (user?.role === "superadmin") return true;
    
    // 3. Check if permissions exist before accessing keys
    // This matches your JSON structure: "Customer Management_View"
    return permissions && permissions[`${key}_View`] === true;
  };

  const NavItem = ({ label, icon, path }) => (
    <div
      onClick={() => navigate(path)}
      className={`flex items-center gap-4 p-3 cursor-pointer rounded-xl mb-1 transition-all duration-200
        ${isActive(path)
          ? "bg-orange-500 text-white shadow-lg"
          : "text-gray-300 hover:bg-orange-500/20 hover:text-white"
        } ${!open ? "justify-center" : ""}`}
    >
      <span className={`text-lg ${!open ? "scale-110" : ""}`}>{icon}</span>
      {open && <span className="text-sm font-medium">{label}</span>}
    </div>
  );

  // If you want to show a spinner or nothing until permissions load:
  if (loading) {
    return <div className="h-screen w-20 bg-[#1E1E1E] animate-pulse" />;
  }

  return (
    <div className={`h-screen ${open ? "w-72 rounded-tr-[50px] rounded-br-[50px]" : "w-20"} bg-[#1E1E1E] border-r border-black/30 shadow-xl flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}>
      
      {/* ... HEADER CODE ... */}

      <div className="flex-1 overflow-y-auto sidebar-scroll px-3 pt-4">
        
        <NavItem label="Dashboard" icon={<LayoutDashboard />} path="/" />

        {/* Individual Conditional Tabs */}
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

        {hasView("Architect Registration") && (
          <NavItem label="Architect Registration" icon={<DraftingCompass />} path="/Architect-Registration" />
        )}

        {/* INVENTORY SECTION */}
        {hasView("Inventory Management") && (
          <div className="mt-2">
            <div onClick={() => setOpenInventory(!openInventory)} className={`flex items-center ${open ? "justify-between" : "justify-center"} p-3 cursor-pointer rounded-xl text-gray-300 hover:bg-orange-500/20`}>
              <div className="flex items-center gap-4">
                <Layers /> {open && <span className="text-sm font-medium">Inventory</span>}
              </div>
              {open && (openInventory ? <ChevronDown size={18}/> : <ChevronRight size={18}/>)}
            </div>
            {openInventory && open && (
              <div className="ml-8 mt-2 flex flex-col gap-1 border-l border-gray-600 pl-4">
                {/* Specific Action Check for Submenu */}
                {permissions?.["Inventory Management_Add"] && (
                   <NavItem label="Add Inventory" icon={<PlusCircle size={16} />} path="/inventory/add" />
                )}
                <NavItem label="Manage Inventory" icon={<ListChecks size={16} />} path="/inventory/manage" />
              </div>
            )}
          </div>
        )}

        {/* QUOTATION SECTION */}
        {hasView("Quotation Management") && (
          <div className="mt-2">
            <div onClick={() => setOpenQuotation(!openQuotation)} className={`flex items-center ${open ? "justify-between" : "justify-center"} p-3 cursor-pointer rounded-xl text-gray-300 hover:bg-orange-500/20`}>
              <div className="flex items-center gap-4">
                <FileSignature /> {open && <span className="text-sm font-medium">Quotation</span>}
              </div>
              {open && (openQuotation ? <ChevronDown size={18}/> : <ChevronRight size={18}/>)}
            </div>
            {openQuotation && open && (
              <div className="ml-8 mt-2 flex flex-col gap-1 border-l border-gray-600 pl-4">
                {permissions?.["Quotation Management_Add"] && (
                  <NavItem label="Add Quotation" icon={<FilePlus size={16} />} path="/quotation/add" />
                )}
                <NavItem label="Manage Quotation" icon={<FileText size={16} />} path="/quotation/manage" />
              </div>
            )}
          </div>
        )}

        {/* BOTTOM MENU */}
        <div className="mt-4 pt-4 border-t border-white/10">
          {hasView("Delivery Challans") && (
            <NavItem label="Delivery Challan" icon={<Truck />} path="/delivery-challan" />
          )}
          <NavItem label="Reports" icon={<FileChartColumn />} path="/report" />
          <NavItem label="Order Book" icon={<NotebookPen />} path="/orderbook" />
          <NavItem label="Payment History" icon={<WalletCards />} path="/payment-history" />
        </div>
      </div>
    </div>
  );
}