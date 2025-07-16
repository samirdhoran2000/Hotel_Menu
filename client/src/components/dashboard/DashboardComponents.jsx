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
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/activity-log`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const payload = await res.json();

        if (payload.success) {
          setRawLogs(payload.data);
          setMostScanTable(payload?.analytics?.topTable[0]);
          setTotalScan(payload?.analytics?.todayCount);
          setMenuCounts(payload?.analytics?.menus);
          setTableCounts(payload?.analytics?.tables);
        }
      } catch (err) {
        console.error(err);
      }
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
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/activity-log`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const payload = await res.json();

        if (payload.success) {
          setRawLogs(payload.data);
        }
      } catch (err) {
        console.error(err);
      }
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
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <QrCode className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                QR Code Management
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {table.length} {table.length === 1 ? "code" : "codes"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchQrCodeDetails}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={openCreateTableModal}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Plus className="w-4 h-4" />
                Add QR Code
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
            <div className="grid gap-4">
              {filteredTables.map((tableItem) => (
                <div
                  key={tableItem.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    {/* Table Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <QrCode className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Table #{tableItem.tableNumber}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            Created{" "}
                            {new Date(tableItem.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* QR Link */}
                      <div className="bg-white rounded-lg p-3 border border-gray-200 flex flex-row justify-between">
                        <div className="w-full">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            QR Code Link
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={tableItem.qrCodeLink}
                              readOnly
                              className="flex-1 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-2"
                            />
                            <button
                              onClick={() =>
                                copyToClipboard(tableItem.qrCodeLink)
                              }
                              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 transition"
                              title="Copy link"
                            >
                              Copy
                            </button>
                            <a
                              href={tableItem.qrCodeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition"
                              title="Open link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                        {/* <div className=""> */}
                        <QRCodeCanvas
                          value={tableItem.qrCodeLink}
                          // height={20}
                          // width={20}
                          className="p-3 bg-blue-50 rounded-xl h-8 w-8"
                        />
                        {/* </div> */}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => {
                          console.log("Downloading QR Code for:", tableItem);
                          
                          navigate(
                            `/hotel/dashboard/qrcode/${tableUniqueCode(tableItem.hotelId, tableItem.tableNumber)}`
                          );
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Download QR Code"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tableItem.id)}
                        className={`p-2 rounded-lg transition ${
                          deleteConfirm === tableItem.id
                            ? "bg-red-100 text-red-700"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                        title={
                          deleteConfirm === tableItem.id
                            ? "Click again to confirm"
                            : "Delete QR Code"
                        }
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirm === tableItem.id && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 mb-2">
                        Are you sure you want to delete this QR code? This
                        action cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(tableItem.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
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
