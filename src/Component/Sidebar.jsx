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

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(true);
  const [openInventory, setOpenInventory] = useState(false);
  const [openQuotation, setOpenQuotation] = useState(false);

  const isActive = (path) => location.pathname === path;

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
      className={`
        h-screen ${open ? "w-72" : "w-20"}
        bg-gradient-to-b from-[#F3F4F6] to-[#E5E7EB]
        border-r border-gray-300 shadow-xl
        flex flex-col transition-all duration-300
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-300">
        {open && (
          <h1 className="text-xl font-semibold text-gray-800 tracking-wide">
            Ceramic Studio
          </h1>
        )}

        <Menu
          onClick={() => setOpen(!open)}
          className="cursor-pointer text-gray-700 hover:text-gray-900 transition"
        />
      </div>

      <div className="py-4 flex-1 overflow-y-auto">

        {/* TOP MENU */}
        {menuTop.map((item, i) => (
          <div
            key={i}
            onClick={() => navigate(item.path)}
            className={`
              flex items-center gap-4 px-5 py-3 cursor-pointer rounded-xl mb-2 transition-all
              ${isActive(item.path)
                ? "bg-gray-800 text-white shadow-md scale-[1.03]"
                : "hover:bg-gray-300 text-gray-800"
              }
            `}
          >
            <span className="text-[20px]">{item.icon}</span>
            {open && <span className="font-medium text-sm">{item.label}</span>}
          </div>
        ))}

        {/* INVENTORY */}
        <div>
          <div
            onClick={() => setOpenInventory(!openInventory)}
            className="flex items-center justify-between px-5 py-3 cursor-pointer rounded-xl 
              hover:bg-gray-300 text-gray-800"
          >
            <div className="flex items-center gap-4">
              <Layers className="text-gray-700" />
              {open && <span className="font-medium text-sm">Inventory</span>}
            </div>

            {open && (openInventory ? <ChevronDown /> : <ChevronRight />)}
          </div>

          {openInventory && open && (
            <div className="ml-10 mt-2 flex flex-col gap-2 border-l border-gray-400 pl-4 animate-expand">
              {inventorySubMenu.map((sub, j) => (
                <div
                  key={j}
                  onClick={() => navigate(sub.path)}
                  className={`
                    flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg transition-all
                    ${isActive(sub.path)
                      ? "bg-gray-800 text-white shadow-md scale-[1.03]"
                      : "text-gray-800 hover:bg-gray-300"
                    }
                  `}
                >
                  {sub.icon}
                  {open && sub.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUOTATION */}
        <div className="mt-3">
          <div
            onClick={() => setOpenQuotation(!openQuotation)}
            className="flex items-center justify-between px-5 py-3 cursor-pointer rounded-xl 
              hover:bg-gray-300 text-gray-800"
          >
            <div className="flex items-center gap-4">
              <FileSignature className="text-gray-700" />
              {open && <span className="font-medium text-sm">Quotation</span>}
            </div>

            {open && (openQuotation ? <ChevronDown /> : <ChevronRight />)}
          </div>

          {openQuotation && open && (
            <div className="ml-10 mt-2 flex flex-col gap-2 border-l border-gray-400 pl-4 animate-expand">
              {quotationSubMenu.map((sub, j) => (
                <div
                  key={j}
                  onClick={() => navigate(sub.path)}
                  className={`
                    flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg transition-all
                    ${isActive(sub.path)
                      ? "bg-gray-800 text-white shadow-md scale-[1.03]"
                      : "text-gray-800 hover:bg-gray-300"
                    }
                  `}
                >
                  {sub.icon}
                  {open && sub.label}
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
              className={`
                flex items-center gap-4 px-5 py-3 cursor-pointer rounded-xl mb-2 transition-all
                ${isActive(item.path)
                  ? "bg-gray-800 text-white shadow-md scale-[1.03]"
                  : "hover:bg-gray-300 text-gray-800"
                }
              `}
            >
              <span className="text-[20px]">{item.icon}</span>
              {open && <span className="font-medium text-sm">{item.label}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes expand {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-expand { animation: expand 0.25s ease-out; }
      `}</style>
    </div>
  );
}
