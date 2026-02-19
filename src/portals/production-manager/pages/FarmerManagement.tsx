import { useState } from 'react';
import {
  Search, Filter, Plus, Download, MoreHorizontal,
  Users, UserCheck, Map, FileWarning, Star, MapPin
} from 'lucide-react';
import FarmerRegistrationModal from '../components/FarmerRegistrationModal';

const FarmerManagement = () => {
  // State
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Stats Logic (Mock for now)
  const stats = [
    { label: 'Total Farmers', value: '612', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Active Suppliers', value: '548', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Hectares', value: '340 Ha', icon: Map, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Pending Certs', value: '12', icon: FileWarning, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', alert: true },
  ];

  // Mock Data for Directory
  const farmers = [
    { id: 1, name: 'Jean Claude', location: 'Nyagatare, Rwimiyaga', crop: 'French Beans', size: '2.5 Ha', status: 'Active', grade: '98% A' },
    { id: 2, name: 'Kirehe Co-op', location: 'Kirehe, Gahara', crop: 'Avocados (Hass)', size: '45.0 Ha', status: 'Active', grade: '95% A' },
    { id: 3, name: 'Marie Claire', location: 'Musanze, Kinigi', crop: 'Passion Fruit', size: '1.2 Ha', status: 'Inactive', grade: '-' },
    { id: 4, name: 'Bugesera Outgrowers', location: 'Bugesera, Mayange', crop: 'Chili Peppers', size: '15.0 Ha', status: 'Active', grade: '92% A' },
    { id: 5, name: 'Robert / Almond', location: 'Rwamagana, Muhazi', crop: 'Mangoes', size: '3.0 Ha', status: 'Auditing', grade: '88% A' },
    { id: 6, name: 'Rusizi Organic', location: 'Rusizi, Kamembe', crop: 'Mixed Veg', size: '8.5 Ha', status: 'Active', grade: '99% A' },
  ];

  // Filter Logic
  const filteredFarmers = farmers.filter(farmer =>
    (statusFilter === 'all' || farmer.status.toLowerCase() === statusFilter.toLowerCase()) &&
    (farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.crop.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-20">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Farmer Network</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage suppliers, cooperatives, and compliance data</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download size={18} />
            Export List
          </button>
          <button
            onClick={() => setIsRegistrationOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Register Farmer
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <div className={`text-2xl font-bold mt-1 ${stat.alert ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                  {stat.value}
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Filters & Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">

        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search farmers, locations, or crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-4 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="auditing">Auditing</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Directory Table */}
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th className="px-6 py-4">Farmer / Co-op</th>
              <th className="px-6 py-4">Main Crop</th>
              <th className="px-6 py-4">Land Size</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Performance</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredFarmers.map((farmer) => (
              <tr key={farmer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{farmer.name}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <MapPin size={10} />
                      {farmer.location}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {farmer.crop}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {farmer.size}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${farmer.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                    farmer.status === 'Inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                      'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
                    }`}>
                    {farmer.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{farmer.grade}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Registration Modal */}
      <FarmerRegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onSubmit={(data) => {
          console.log('New Farmer:', data);
          setIsRegistrationOpen(false);
          // Refresh logic would go here
        }}
      />
    </div>
  );
};

export default FarmerManagement;
