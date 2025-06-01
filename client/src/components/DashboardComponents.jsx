import { BarChart3 } from "lucide-react";

const DashboardHome = () => {
  return (
    <div className="max-w-full">
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Dashboard
        </h2>
        <p className="text-gray-600">This is your main dashboard overview.</p>
      </div>

      {/* Sample Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Users",
            value: "12,543",
            change: "+12%",
            color: "bg-blue-500",
          },
          {
            title: "Revenue",
            value: "$45,678",
            change: "+8%",
            color: "bg-green-500",
          },
          {
            title: "Orders",
            value: "1,234",
            change: "+15%",
            color: "bg-purple-500",
          },
          {
            title: "Growth",
            value: "23%",
            change: "+3%",
            color: "bg-orange-500",
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
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {stat.change} from last month
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Analytics Overview
          </h3>
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart or main content goes here</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              "New user registered",
              "Order #1234 completed",
              "Payment processed",
              "Report generated",
              "System backup completed",
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
    </div>
  );
};

// src/components/dashboard/Analytics.jsx

const Analytics = () => {
  return (
    <div className="max-w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h2>
        <p className="text-gray-600">Detailed analytics and reports.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Analytics Dashboard
        </h3>
        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">
            Analytics charts and data visualization goes here
          </p>
        </div>
      </div>
    </div>
  );
};

// src/components/dashboard/Users.jsx

const Users = () => {
  return (
    <div className="max-w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Users Management
        </h2>
        <p className="text-gray-600">Manage your users and permissions.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User List</h3>
        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">User management interface goes here</p>
        </div>
      </div>
    </div>
  );
};

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
  return (
    <div className="max-w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Configure your application settings.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          System Settings
        </h3>
        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">
            Settings configuration interface goes here
          </p>
        </div>
      </div>
    </div>
  );
};

export { Settings, Reports, Orders, Users, Analytics, DashboardHome };
