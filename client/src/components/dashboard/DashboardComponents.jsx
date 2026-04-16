import {
  BarChart3,
  X,
  User,
  Mail,
  Phone,
  Lock,
  UserCheck,
  Plus,
  Trash2,
  Edit,
  QrCode,
  ExternalLink,
  Calendar,
  AlertCircle,
  RefreshCw,
  Search,
  QrCodeIcon,
  Download,
} from "lucide-react";
import { useEffect, useState } from "react";
import TableForm from "./TableForm";
import { QRCodeCanvas } from "qrcode.react";
// import TableForm from "../../temp/TableForm";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import MenuItemForm from "./MenuItemForm";
import Chart from "./Chart"; // Assuming you have a Chart component for the area chart
import MenuVisitedTrend from "./Chart";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isTableFormOpen, setIsTableFormOpen] = useState(false);
  const [tableEditingItemId, setTableEditingItemId] = useState(null);

  const [totalScan, setTotalScan] = useState(0);
  const [mostScanTable, setMostScanTable] = useState({});
  const [menuCounts, setMenuCounts] = useState({});
  const [tableCounts, setTableCounts] = useState({});

  const [rawLogs, setRawLogs] = useState([]);
  const [chartData, setChartData] = useState([]);

  // 1) Fetch the last 7 days of logs
  useEffect(() => {
    async function load() {
      // API call to activity-log removed to stop functionality from frontend side
      setRawLogs([]);
      setMostScanTable({});
      setTotalScan(0);
      setMenuCounts({});
      setTableCounts({});
    }
    load();
  }, []);

  // 2) Re‑compute chartData whenever rawLogs changes
  useEffect(() => {
    // 1) Build an array of the last 7 dates (with both isoKey & label)
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      const isoKey = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
      const label = d.toLocaleDateString("en-US", {
        // "Mon", "Tue", …
        weekday: "short",
      });
      return { isoKey, label };
    });

    // 2) Initialize counts for each date
    const counts = days.reduce((acc, { isoKey }) => {
      acc[isoKey] = 0;
      return acc;
    }, {});

    // 3) Filter & tally only logs whose date-key is in our 7-day window
    rawLogs.forEach((log) => {
      const logDate = new Date(log.createdAt);
      const key = logDate.toISOString().slice(0, 10);
      if (counts[key] != null) {
        counts[key]++;
      }
    });

    // 4) Build final chart data in the right order
    setChartData(
      days.map(({ isoKey, label }) => ({
        name: label,
        views: counts[isoKey],
      }))
    );
  }, [rawLogs]);
  

  const openCreateModal = () => {
    setEditingItemId(null);
    setIsFormOpen(true);
  };

  const openEditModal = (id) => {
    setEditingItemId(id);
    setIsFormOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setEditingItemId(null);
  };

  // After creating or updating, re-fetch the list
  const handleSaveSuccess = () => {
    closeModal();
    // fetchMenuItems();
  };

  const openCreateTableModal = () => {
    setTableEditingItemId(null);
    setIsTableFormOpen(true);
  };

  const openEditTableModal = (id) => {
    setTableEditingItemId(id);
    setIsTableFormOpen(true);
  };

  const closeTableModal = () => {
    setIsTableFormOpen(false);
    setTableEditingItemId(null);
  };

  const handleTableSaveSuccess = () => {
    closeTableModal();
    // fetchQrCodeDetails();
  };

  return (
    <div className="max-w-full">
      {/* Page Title */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Dashboard
          </h2>
          {/* <p className="text-gray-600">This is your main dashboard overview.</p> */}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              openCreateModal();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 shadow-sm font-medium"
          >
            <Plus size={16} />
            Add Menu
          </button>
          <button
            onClick={() => {
              openCreateTableModal();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm font-medium"
          >
            <QrCode size={16} />
            Create QR
          </button>
        </div>
      </div>

      {/* Sample Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total/ Active Menu's",
            totalValue: menuCounts?.totalMenus,
            activeValue: menuCounts?.activeMenus,
            // change: "-12%",
            color: "bg-blue-500",
          },
          {
            title: "Total/ Active QR ",
            totalValue: tableCounts?.totalTables,
            activeValue: tableCounts?.activeTables,
            // change: "-8%",
            color: "bg-green-500",
          },
          {
            title: "Total Scan Today",
            totalValue: totalScan || 0,
            // change: "+15%",
            from:"From last 24 hours",
            color: "bg-purple-500",
          },
          {
            title: "Most Scan Table",
            totalValue: mostScanTable?.Table?.tableNumber || "N/A",
            change: mostScanTable?.count || 0,
            color: "bg-orange-500",
            from: "last 7 days",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat?.totalValue}
                  {stat.activeValue && " /"} {stat?.activeValue}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {stat.change} - {stat?.from ? stat?.from : "From last week"}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <BarChart3 className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Large Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          {/* <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Analytics Overview
          </h3> */}
          {/* <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center"> */}

          <Chart data={chartData} />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Most Viewed Menu
          </h3>
          <div className="space-y-4">
            {[
              "Paneer Tikka Masala",
              "Chicken Biryani",
              "Veg Fried Rice",
              "Caesar Salad",
              "Chocolate Lava Cake",
              "Spaghetti Carbonara",
              "Margherita Pizza",
              // "Grilled Salmon with Asparagus",
              // "Beef Tacos with Guacamole",
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-gray-700">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isFormOpen && (
        <MenuItemForm
          itemId={editingItemId} // if null, treat as "create"
          onClose={closeModal}
          onSuccess={handleSaveSuccess} // called after successful create/update
        />
      )}

      {/* Modal */}
      {isTableFormOpen && (
        <TableForm
          itemId={tableEditingItemId}
          onClose={closeTableModal}
          onSuccess={handleTableSaveSuccess}
        />
      )}
    </div>
  );
};

// src/components/dashboard/Analytics.jsx

const Analytics = () => {
  const [rawLogs, setRawLogs] = useState([]);
  const [chartData, setChartData] = useState([]);

   useEffect(() => {
    async function load() {
      // API call to activity-log removed
      setRawLogs([]);
    }
    load();
   }, []);
  
  
   // 2) Re‑compute chartData whenever rawLogs changes
   useEffect(() => {
     // 1) Build an array of the last 7 dates (with both isoKey & label)
     const today = new Date();
     const days = Array.from({ length: 7 }).map((_, i) => {
       const d = new Date();
       d.setDate(today.getDate() - (6 - i));
       const isoKey = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
       const label = d.toLocaleDateString("en-US", {
         // "Mon", "Tue", …
         weekday: "short",
       });
       return { isoKey, label };
     });

     // 2) Initialize counts for each date
     const counts = days.reduce((acc, { isoKey }) => {
       acc[isoKey] = 0;
       return acc;
     }, {});

     // 3) Filter & tally only logs whose date-key is in our 7-day window
     rawLogs.forEach((log) => {
       const logDate = new Date(log.createdAt);
       const key = logDate.toISOString().slice(0, 10);
       if (counts[key] != null) {
         counts[key]++;
       }
     });

     // 4) Build final chart data in the right order
     setChartData(
       days.map(({ isoKey, label }) => ({
         name: label,
         views: counts[isoKey],
       }))
     );
   }, [rawLogs]);
  

  
  
  return (
    <div className="max-w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h2>
        <p className="text-gray-600">Detailed analytics and reports.</p>
      </div>

      <MenuVisitedTrend data={chartData}/>
    </div>
  );
};

// src/components/dashboard/Users.jsx

// src/components/dashboard/Orders.jsx

const Orders = () => {
  return (
    <div className="max-w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Orders</h2>
        <p className="text-gray-600">Manage and track your orders.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Management
        </h3>
        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Order management interface goes here</p>
        </div>
      </div>
    </div>
  );
};

// src/components/dashboard/Reports.jsx

const Reports = () => {
  return (
    <div className="max-w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reports</h2>
        <p className="text-gray-600">Generate and view detailed reports.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Report Generator
        </h3>
        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Report generation interface goes here</p>
        </div>
      </div>
    </div>
  );
};

// src/components/dashboard/Settings.jsx

const Settings = () => {
  const [table, setTable] = useState([]);
  const [isTableFormOpen, setIsTableFormOpen] = useState(false);
  const [tableEditingItemId, setTableEditingItemId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const navigate = useNavigate();

  const tableUniqueCode = (hotelId, TableNo) => {

    const rawString = `${hotelId}:${TableNo}`;
    return btoa(rawString);
   }

  async function fetchQrCodeDetails() {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/table`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setTable(data);
      } else {
        setError(data.message || "Failed to fetch QR codes");
        console.error("Failed to fetch menu items:", data.message);
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Network error fetching menu items:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchQrCodeDetails();
  }, []);

  const openCreateTableModal = () => {
    setTableEditingItemId(null);
    setIsTableFormOpen(true);
  };

  const openEditTableModal = (id) => {
    setTableEditingItemId(id);
    setIsTableFormOpen(true);
  };

  const closeTableModal = () => {
    setIsTableFormOpen(false);
    setTableEditingItemId(null);
  };

  const handleTableSaveSuccess = () => {
    closeTableModal();
    fetchQrCodeDetails();
  };

  const handleDelete = async (id) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/table/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setTable((prev) => prev.filter((item) => item.id !== id));
        setDeleteConfirm(null);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to delete QR code");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (tableObj) => {
    openEditTableModal(tableObj.id);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const filteredTables = table.filter(
    (item) =>
      item.tableNumber.toString().includes(searchTerm) ||
      item.qrCodeLink.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">Loading QR codes...</span>
    </div>
  );

  const ErrorMessage = () => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={fetchQrCodeDetails}
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No QR Codes Yet
      </h3>
      <p className="text-gray-500 mb-6">
        Create your first QR code to get started
      </p>
      <button
        onClick={openCreateTableModal}
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
      >
        <Plus className="w-5 h-5" />
        Create QR Code
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your QR codes and table configurations
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Card Header */}
        <div className="border-b border-gray-200 bg-gray-50/50 px-4 md:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/10 p-2 rounded-xl">
                <QrCode className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 leading-tight">
                  QR Code Management
                </h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                  {table.length} {table.length === 1 ? "Configuration" : "Configurations"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={fetchQrCodeDetails}
                className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-95 border border-transparent hover:border-blue-100"
                title="Refresh List"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={openCreateTableModal}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-black/10 text-xs font-bold active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add QR Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {table.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by table number or QR link..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage />
          ) : filteredTables.length === 0 ? (
            searchTerm ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No QR codes match your search.</p>
              </div>
            ) : (
              <EmptyState />
            )
          ) : (
            <div className="grid gap-6">
              {filteredTables.map((tableItem) => (
                <div
                  key={tableItem.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* QR Code Column - Primary on mobile */}
                    <div className="flex flex-row md:flex-col items-center gap-4 md:items-center">
                      <div className="relative group/qr p-2 bg-slate-50 rounded-2xl border border-slate-100 transition-all group-hover:bg-blue-50/50 group-hover:border-blue-100 shrink-0">
                        <QRCodeCanvas
                          value={tableItem.qrCodeLink}
                          size={120} // Larger size for better visibility
                          className="rounded-xl w-24 h-24 md:w-32 md:h-32 shadow-sm"
                        />
                      </div>
                      <div className="flex flex-col md:items-center gap-2 w-full">
                         <div className="md:hidden">
                            <h3 className="text-xl font-black text-gray-900 leading-none">Table #{tableItem.tableNumber}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Created {new Date(tableItem.createdAt).toLocaleDateString()}</p>
                         </div>
                         <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/hotel/dashboard/qrcode/${tableUniqueCode(tableItem.hotelId, tableItem.tableNumber)}`)}
                              className="flex-1 md:w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all shadow-sm active:scale-95"
                            >
                              <Download className="w-4 h-4" />
                              <span>Card</span>
                            </button>
                            <button
                              onClick={() => handleDelete(tableItem.id)}
                              className={`p-2 rounded-xl transition-all active:scale-95 shrink-0 ${
                                deleteConfirm === tableItem.id
                                  ? "bg-red-600 text-white shadow-lg shadow-red-200"
                                  : "bg-red-50 text-red-600 hover:bg-red-100 border border-transparent hover:border-red-200"
                              }`}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="hidden md:flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                            Table #{tableItem.tableNumber}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>Created {new Date(tableItem.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* URL Box */}
                      <div className="mt-auto space-y-3">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Redirection Link</span>
                           {/* External Link button moved here for visibility */}
                           <a
                              href={tableItem.qrCodeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full transition-all hover:bg-blue-100"
                            >
                              <span className="hidden sm:inline">Go to Menu</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                        
                        <div className="flex items-stretch gap-2">
                           <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 flex items-center min-w-0">
                              <span className="text-sm text-gray-500 font-medium truncate">{tableItem.qrCodeLink}</span>
                           </div>
                           <button
                             onClick={() => copyToClipboard(tableItem.qrCodeLink)}
                             className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-black/5"
                           >
                             Copy
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delete Confirmation Overlay */}
                  {deleteConfirm === tableItem.id && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-red-900 leading-tight">Delete this menu link?</p>
                          <p className="text-xs text-red-700 mt-1">This will permanently disable this QR code. You can't undo this.</p>
                          <div className="flex gap-3 mt-3">
                            <button
                              onClick={() => handleDelete(tableItem.id)}
                              className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-700 transition shadow-md shadow-red-200"
                            >
                              Delete Now
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-4 py-1.5 bg-white text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-100 hover:bg-red-50 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isTableFormOpen && (
        <TableForm
          itemId={tableEditingItemId}
          onClose={closeTableModal}
          onSuccess={handleTableSaveSuccess}
        />
      )}
    </div>
  );
};

export { Settings, Reports, Orders, Analytics, DashboardHome };
