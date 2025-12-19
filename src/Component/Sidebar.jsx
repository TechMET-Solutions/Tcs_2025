import {
  BadgeCheck,
  ChevronDown,
  ChevronRight,
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

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(true);
  const [openInventory, setOpenInventory] = useState(false);
  const [openQuotation, setOpenQuotation] = useState(false);

  const isActive = (path) => location.pathname === path;

  /* Close submenus when sidebar collapses */
  useEffect(() => {
    if (!open) {
      setOpenInventory(false);
      setOpenQuotation(false);
    }
  }, [open]);

  const menuTop = [
    { label: "Dashboard", icon: <LayoutDashboard />, path: "/" },
    { label: "Customer Management", icon: <Users />, path: "/Customer-Management" },
    { label: "Employee Registration", icon: <UserPlus />, path: "/employee-registration" },
    { label: "Quality Management", icon: <BadgeCheck />, path: "/Quality-Management" },
    { label: "Category Management", icon: <Grid2X2 />, path: "/Category-Management" },
    { label: "Brand Management", icon: <Tag />, path: "/Brand-Management" },
    { label: "Product Registration", icon: <Package />, path: "/product-registration" },
    { label: "Architect Registration", icon: <Package />, path: "/Architect-Registration" },
  ];

  const inventorySubMenu = [
    { label: "Add Inventory", icon: <PlusCircle size={16} />, path: "/inventory/add" },
    { label: "Manage Inventory", icon: <ListChecks size={16} />, path: "/inventory/manage" },
  ];

  const quotationSubMenu = [
    { label: "Add Quotation", icon: <FilePlus size={16} />, path: "/quotation/add" },
    { label: "Manage Quotation", icon: <FileText size={16} />, path: "/quotation/manage" },
  ];

  const menuBottom = [
    { label: "Delivery Challan", icon: <Truck />, path: "/delivery-challan" },
    { label: "Reports", icon: <FileChartColumn />, path: "/report" },
    { label: "Order Book", icon: <NotebookPen />, path: "/orderbook" },
    { label: "Payment History", icon: <WalletCards />, path: "/payment-history" },
  ];

  return (
    <div
      className={`h-screen ${
        open ? "w-72 rounded-tr-[50px] rounded-br-[50px]" : "w-20"
      } bg-[#1E1E1E] border-r border-black/30 shadow-xl flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-5 min-h-[80px]">
        {open ? (
          <img 
            src={LOGO} 
            alt="logo" 
            className="w-[75%] transition-all duration-300 ease-in-out opacity-100" 
          />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center transition-all duration-300">
            <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-orange-500/20 transition-colors duration-200"
        >
          <Menu className="text-white hover:text-orange-400 transition-colors duration-200" />
        </button>
      </div>

      {/* MENU WRAPPER */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll px-3">
        {/* TOP MENU */}
        {menuTop.map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-4 p-3 cursor-pointer rounded-xl mb-1 transition-all duration-200
              ${
                isActive(item.path)
                  ? "bg-orange-500 text-white shadow-lg"
                  : "text-gray-300 hover:bg-orange-500/20 hover:text-white"
              } ${!open ? "justify-center" : ""}`}
          >
            <span className={`text-lg ${!open ? "scale-110" : ""}`}>{item.icon}</span>
            {open && (
              <span 
                className="text-sm font-medium transition-opacity duration-200 opacity-100"
              >
                {item.label}
              </span>
            )}
          </div>
        ))}

        {/* INVENTORY */}
        <div className="mt-2">
          <div
            onClick={() => setOpenInventory(!openInventory)}
            className={`flex items-center ${
              open ? "justify-between" : "justify-center"
            } p-3 cursor-pointer rounded-xl text-gray-300 hover:bg-orange-500/20 hover:text-white transition-all duration-200`}
          >
            <div className="flex items-center gap-4">
              <Layers />
              {open && (
                <span className="text-sm font-medium transition-opacity duration-200">
                  Inventory
                </span>
              )}
            </div>
            {open && (openInventory ? <ChevronDown /> : <ChevronRight />)}
          </div>

          {openInventory && open && (
            <div 
              className="ml-8 mt-2 flex flex-col gap-1 border-l border-gray-600 pl-4 transition-all duration-300"
              style={{
                animation: "expand 0.3s ease-out"
              }}
            >
              {inventorySubMenu.map((sub, j) => (
                <div
                  key={j}
                  onClick={() => navigate(sub.path)}
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200
                    ${
                      isActive(sub.path)
                        ? "bg-orange-500 text-white"
                        : "text-gray-300 hover:bg-orange-500/20 hover:text-white"
                    }`}
                >
                  {sub.icon}
                  <span className="text-sm">{sub.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUOTATION */}
        <div className="mt-2">
          <div
            onClick={() => setOpenQuotation(!openQuotation)}
            className={`flex items-center ${
              open ? "justify-between" : "justify-center"
            } p-3 cursor-pointer rounded-xl text-gray-300 hover:bg-orange-500/20 hover:text-white transition-all duration-200`}
          >
            <div className="flex items-center gap-4">
              <FileSignature />
              {open && (
                <span className="text-sm font-medium transition-opacity duration-200">
                  Quotation
                </span>
              )}
            </div>
            {open && (openQuotation ? <ChevronDown /> : <ChevronRight />)}
          </div>

          {openQuotation && open && (
            <div 
              className="ml-8 mt-2 flex flex-col gap-1 border-l border-gray-600 pl-4 transition-all duration-300"
              style={{
                animation: "expand 0.3s ease-out"
              }}
            >
              {quotationSubMenu.map((sub, j) => (
                <div
                  key={j}
                  onClick={() => navigate(sub.path)}
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200
                    ${
                      isActive(sub.path)
                        ? "bg-orange-500 text-white"
                        : "text-gray-300 hover:bg-orange-500/20 hover:text-white"
                    }`}
                >
                  {sub.icon}
                  <span className="text-sm">{sub.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM MENU */}
        <div className="mt-4">
          {menuBottom.map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 p-3 cursor-pointer rounded-xl mb-1 transition-all duration-200
                ${
                  isActive(item.path)
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-orange-500/20 hover:text-white"
                } ${!open ? "justify-center" : ""}`}
            >
              <span className={`text-lg ${!open ? "scale-110" : ""}`}>{item.icon}</span>
              {open && (
                <span className="text-sm font-medium transition-opacity duration-200">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Optional: Add a subtle indicator when sidebar is minimized */}
      {!open && (
        <div className="absolute bottom-4 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
      )}

      {/* HIDE SCROLLBAR & ANIMATIONS */}
      <style>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: #2d2d2d;
          border-radius: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #555 #2d2d2d;
        }
        
        @keyframes expand {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(-10px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        /* Smooth text fade */
        .text-fade-enter {
          opacity: 0;
          transform: translateX(-10px);
        }
        .text-fade-enter-active {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 200ms, transform 200ms;
        }
        .text-fade-exit {
          opacity: 1;
          transform: translateX(0);
        }
        .text-fade-exit-active {
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 200ms, transform 200ms;
        }
      `}</style>
    </div>
  );
}