import { Bell, LogOut, Settings, X } from "lucide-react"; // Added X icon
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { BASEURL } from "./API/Url";

export default function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false); // New State
  const navigate = useNavigate();
const { permissions, user, loading, role } = useAuth(); 


  // const { user } = useAuth();

  console.log(user)

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // Mock notifications data
  const notifications = [
    { id: 1, text: "New employee registered", time: "2 mins ago" },
    { id: 2, text: "Attendance report generated", time: "1 hour ago" },
    { id: 3, text: "System update scheduled", time: "Yesterday" },
  ];

  return (
    <div className="h-16 px-6 bg-gradient-to-r from-[#F2F4F7] to-[#E4E7EB] backdrop-blur-md shadow-md flex items-center justify-between border-b border-gray-300">

      {/* LEFT TITLE */}
      <h1 className="text-2xl font-semibold text-[#1F3A93] tracking-wide">
        Dashboard
      </h1>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-5">

        {/* 🔔 NOTIFICATION */}
        <div className="relative">
          <div
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:shadow-lg cursor-pointer border border-gray-300 hover:bg-gray-200 transition"
          >
            <Bell size={20} className="text-[#1F3A93]" />
            {/* Optional Red Dot Badge */}
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </div>

          {/* NOTIFICATION MODAL/DROPDOWN */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 shadow-xl rounded-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
                <span className="font-bold text-[#1F3A93]">Notifications</span>
                <button onClick={() => setNotificationsOpen(false)}>
                  <X size={16} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-blue-50 border-b border-gray-50 cursor-pointer transition">
                      <p className="text-sm text-gray-800">{n.text}</p>
                      <span className="text-[11px] text-gray-400">{n.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-400 text-sm">
                    No new notifications
                  </div>
                )}
              </div>

              <div className="p-2 text-center border-t border-gray-100">
                <button className="text-xs text-[#1F3A93] font-medium hover:underline">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ⚙️ SETTINGS */}
        {(role === "admin" || role === "superadmin") && (

 <div className="relative">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:shadow-lg cursor-pointer border border-gray-300 hover:bg-gray-200 transition"
            onClick={() => {
              setSettingsOpen(!settingsOpen);
              setNotificationsOpen(false); // Close others when opening settings
            }}
          >
            <Settings size={20} className="text-[#1F3A93]" />
          </div>

          {settingsOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 shadow-lg rounded-lg z-50 text-sm">
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate("/employee-role");
                    setSettingsOpen(false);
                  }}
                >
                  Employee Role
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate("/employee-attendance");
                    setSettingsOpen(false);
                  }}
                >
                  Employee Attendance
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate("/work-panel"); // Route for Admin to assign tasks
                    setSettingsOpen(false);
                  }}
                >
                  Work Panel
                  </li>
                  <li
  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 font-medium"
  onClick={() => {
    navigate("/expense-panel");
    setSettingsOpen(false);
  }}
>
  Expense Panel
</li>
              </ul>
            </div>
          )}
        </div>
                        )}
        

        {/* 👤 PROFILE */}
        <div className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img
              src={
                user?.profile_photo
                  ? `${BASEURL}/uploads/employees/${user.profile_photo}`
                  : "https://i.pravatar.cc/40"
              }
              alt={user?.name || "User"}
              className="w-10 h-10 rounded-full border-2 border-[#1F3A93] shadow object-cover"
            />

            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-[15px] font-semibold text-[#3A3A3A]">
                {user?.name || "User"}
              </span>
              <span className="text-[12px] text-gray-500">
                {user?.email || ""}
              </span>
            </div>
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
              <ul className="py-2 text-sm">
                <li
                  className="px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}