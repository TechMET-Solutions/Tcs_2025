import axios from "axios";
import { Bell, LogOut, Settings, X } from "lucide-react";
import { useEffect, useState, useRef } from "react"; // 1. Added useRef
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { BASEURL } from "./API/Url";

export default function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // 2. Refs create kiye dropdowns ke liye
  const notificationRef = useRef(null);
  const settingsRef = useRef(null);
  const profileRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const { user, role } = useAuth();

  // 3. Click Outside logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Notification close logic
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      // Settings close logic
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
      // Profile close logic
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const fetchNotifications = async (pageNo = 1, append = false) => {
    try {
      const params =
        role === "admin" || role === "superadmin"
          ? { role: "Admin", page: pageNo, limit: 10 }
          : {
            role: "Employee",
            employeeId: user?.id,
            page: pageNo,
            limit: 10,
          };

      const res = await axios.get(`${BASEURL}/api/users/GetNotification`, { params });

      if (res.data.success) {
        const newData = res.data.data.map((n) => ({
          id: n.id,
          text: n.message,
          time: new Date(n.createdAt).toLocaleString(),
        }));

        if (append) {
          setNotifications((prev) => [...prev, ...newData]);
        } else {
          setNotifications(newData);
        }

        setHasMore(pageNo < res.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  useEffect(() => {
    if (notificationsOpen) {
      setPage(1);
      fetchNotifications(1, false);
    }
  }, [notificationsOpen]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  };

  return (
    <div className="h-16 px-6 bg-gradient-to-r from-[#F2F4F7] to-[#E4E7EB] shadow-md flex items-center justify-between border-b border-gray-300">
      <h1 className="text-2xl font-semibold text-[#1F3A93]">Dashboard</h1>

      <div className="flex items-center gap-5">

        {/* 🔔 Notifications - Ref added to parent div */}
        <div className="relative" ref={notificationRef}>
          <div
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setSettingsOpen(false); // Doosra close karein
              setProfileOpen(false);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow cursor-pointer border hover:bg-gray-200"
          >
            <Bell size={20} className="text-[#1F3A93]" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </div>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border shadow-xl rounded-xl z-50 overflow-hidden">
              {/* ... (rest of your notification UI) */}
              <div className="px-4 py-3 border-b flex justify-between bg-[#F8FAFC]">
                <span className="font-bold text-[#1F3A93]">Notifications</span>
                <button onClick={() => setNotificationsOpen(false)}><X size={16} /></button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-blue-50 border-b">
                      <p className="text-sm">{n.text}</p>
                      <span className="text-[11px] text-gray-400">{n.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                )}
              </div>
              {hasMore && (
                <div className="p-2 text-center border-t">
                  <button onClick={loadMore} className="text-xs text-[#1F3A93] font-medium hover:underline">Load more</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ⚙️ Settings - Ref added to parent div */}
        {/* ⚙️ Settings */}
        <div className="relative" ref={settingsRef}>
          <div
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow cursor-pointer border hover:bg-gray-200"
            onClick={() => {
              setSettingsOpen(!settingsOpen);
              setNotificationsOpen(false);
              setProfileOpen(false);
            }}
          >
            <Settings size={20} className="text-[#1F3A93]" />
          </div>

          {settingsOpen && (
            <div className="absolute right-0 mt-3 w-52 bg-white border shadow rounded-lg z-50 text-sm">
              <ul className="py-2">
                {(role === "admin" || role === "superadmin") && (
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate("/employee-role");
                      setSettingsOpen(false); // Click hone par close hoga
                    }}
                  >
                    Employee Role
                  </li>
                )}

                {(role === "admin" || role === "superadmin") && (
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate("/employee-attendance");
                      setSettingsOpen(false); // Click hone par close hoga
                    }}
                  >
                    Employee Attendance
                  </li>
                )}

                {(role === "admin" || role === "superadmin") && (
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                    onClick={() => {
                      navigate("/expense-panel");
                      setSettingsOpen(false); // Click hone par close hoga
                    }}
                  >
                    Expense Panel
                  </li>
                )}

                {role !== "admin" && role !== "superadmin" && (
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600"
                    onClick={() => {
                      navigate("/walletSystem");
                      setSettingsOpen(false); // Click hone par close hoga
                    }}
                  >
                    My Wallet
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* 👤 Profile - Ref added to parent div */}
        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
              setSettingsOpen(false);
            }}
          >
            <img
              src={user?.profile_photo ? `${BASEURL}/uploads/employees/${user.profile_photo}` : "https://i.pravatar.cc/40"}
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-[#1F3A93]"
            />
            <div className="hidden md:block">
              <div className="font-semibold">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-white border shadow rounded-lg z-50">
              <div
                className="px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={16} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}