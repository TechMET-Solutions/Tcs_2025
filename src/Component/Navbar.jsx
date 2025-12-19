import { Bell, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className="
        h-16 px-6 bg-gradient-to-r from-[#F2F4F7] to-[#E4E7EB]
        backdrop-blur-md shadow-md flex items-center justify-between
        border-b border-gray-300
      "
    >
      {/* LEFT TITLE */}
      <h1 className="text-2xl font-semibold text-[#1F3A93] tracking-wide">
        Dashboard
      </h1>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-5">

        {/* 🔔 NOTIFICATION */}
        <div className="
          w-10 h-10 flex items-center justify-center rounded-full 
          bg-white shadow hover:shadow-lg cursor-pointer 
          border border-gray-300 hover:bg-gray-200 transition
        ">
          <Bell size={20} className="text-[#1F3A93]" />
        </div>

        {/* ⚙️ SETTINGS */}
        <div className="relative">
          <div
            className="
              w-10 h-10 flex items-center justify-center rounded-full 
              bg-white shadow hover:shadow-lg cursor-pointer 
              border border-gray-300 hover:bg-gray-200 transition
            "
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <Settings size={20} className="text-[#1F3A93]" />
          </div>

          {settingsOpen && (
            <div className="
              absolute right-0 mt-2 w-52 bg-white border border-gray-200 
              shadow-lg rounded-lg z-50 text-sm
            ">
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
              </ul>
            </div>
          )}
        </div>

        {/* 👤 PROFILE */}
      <div className="relative">
  {/* PROFILE CLICK AREA */}
  <div
    className="flex items-center gap-3 cursor-pointer"
    onClick={() => setProfileOpen(!profileOpen)}
  >
    <img
      src="https://i.pravatar.cc/40"
      alt="User"
      className="w-10 h-10 rounded-full border-2 border-[#1F3A93] shadow"
    />

    <div className="hidden md:flex flex-col leading-tight">
      <span className="text-[15px] font-semibold text-[#3A3A3A]">
        Sumit
      </span>
      <span className="text-[12px] text-[#1F3A93]">
        Administrator
      </span>
    </div>
  </div>

  {/* 🔽 PROFILE DROPDOWN */}
  {profileOpen && (
    <div
      className="
        absolute right-0 mt-3 w-44 bg-white border border-gray-200 
        shadow-lg rounded-lg z-50
      "
    >
      <ul className="py-2 text-sm">
        <li
          className="
            px-4 py-2 hover:bg-red-50 text-red-600 
            flex items-center gap-2 cursor-pointer
          "
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
