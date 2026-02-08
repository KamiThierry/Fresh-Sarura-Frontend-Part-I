import { useState } from 'react';
import { Bell, Search, Home, Users, Package, Truck, FileCheck, BarChart3, MessageSquare, Settings, Leaf, ShieldCheck, LogOut, Sprout } from 'lucide-react';
import DashboardStats from './components/DashboardStats';
import ExportTrendsChart from './components/ExportTrendsChart';
import QCResultsChart from './components/QCResultsChart';
import LossAnalyticsChart from './components/LossAnalyticsChart';
import RecentActivityTable from './components/RecentActivityTable';
import QuickActionsGrid from './components/QuickActionsGrid';
import FarmerManagement from './pages/FarmerManagement';
import InventoryManagement from './pages/InventoryManagement';
import QualityControl from './pages/QualityControl';
import Logistics from './pages/Logistics';
import CreatePackingListDrawer from './components/CreatePackingListDrawer';
import ThemeToggle from './components/ThemeToggle';
import CropPlanning from './pages/CropPlanning';
import Traceability from './pages/Traceability';
import AnalyticsReporting from './pages/AnalyticsReporting';
import SettingsPage from './pages/Settings';

import LogIntakeForm from './components/LogIntakeForm';
import QCInspectionDrawer from './components/QCInspectionDrawer';
import CreateShipmentForm from './components/CreateShipmentForm';
import FindBatchDrawer from './components/FindBatchDrawer';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isQCOpen, setIsQCOpen] = useState(false);
  const [isShipmentOpen, setIsShipmentOpen] = useState(false);
  const [isTraceabilityOpen, setIsTraceabilityOpen] = useState(false);
  const [isPackingListOpen, setIsPackingListOpen] = useState(false);

  const [currentIntake, setCurrentIntake] = useState(2450); // Initial value in kg
  const [qualityGrade, setQualityGrade] = useState("96% Class A");
  const [scheduledExports, setScheduledExports] = useState(8000); // 8000 kg = 8 Tons

  const handleLogIntake = () => {
    setIsIntakeOpen(true);
  };

  const handleIntakeSubmit = (weight: number) => {
    setCurrentIntake((prev) => prev + weight);
    setIsIntakeOpen(false);
    // You could show a toast here
    alert(`Successfully logged ${weight} kg! New total: ${currentIntake + weight} kg`);
  };

  const handleQCInspection = () => {
    setIsQCOpen(true);
  };

  const handleQCSubmit = (result: string) => {
    setQualityGrade(result);
    setIsQCOpen(false);
    alert(`QC Inspection Submitted! New Grade: ${result}`);
  };

  const handleCreateShipment = () => {
    setIsShipmentOpen(true);
  };

  const handleShipmentSubmit = (weight: number) => {
    setScheduledExports((prev) => prev + weight);
    setIsShipmentOpen(false);
    alert(`Shipment Booked! Added ${weight} kg to schedule.`);
  };

  const handleFindBatch = () => {
    setIsTraceabilityOpen(true);
  };

  const handleCreatePackingList = () => {
    setIsPackingListOpen(true);
  };

  const handlePackingListSubmit = (data: any) => {
    setIsPackingListOpen(false);
    alert(`Packing List Created for ${data.client} on Flight ${data.flightNo}!`);
  }

  const navGroups = [
    {
      title: 'Main',
      items: [
        { id: 'home', icon: Home, label: 'Home' },
      ]
    },
    {
      title: 'Operations Flow',
      items: [
        { id: 'farmers', icon: Users, label: 'Farmer Management' },
        { id: 'crop-planning', icon: Sprout, label: 'Crop Planning' },
        { id: 'batches', icon: Package, label: 'Inventory & Batches' },
        { id: 'qc', icon: ShieldCheck, label: 'Quality Control (QC)' },
        { id: 'logistics', icon: Truck, label: 'Logistics & Scheduling' },
        { id: 'communication', icon: MessageSquare, label: 'Communication' },
      ]
    },
    {
      title: 'Insights',
      items: [
        { id: 'analytics', icon: BarChart3, label: 'Analytics & Reporting' },
        { id: 'traceability', icon: FileCheck, label: 'Traceability' },
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'admin', icon: Settings, label: 'Settings' },
        { id: 'logout', icon: LogOut, label: 'Sign Out' },
      ]
    }
  ];

  return (
    <div className="relative h-screen bg-[#F4F7FA] dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-300">
      {/* Background Map/Analytics Area */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F4F7FA] via-[#E8F5E9] to-[#F4F7FA] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-40"></div>

      {/* FIXED Left Sidebar (Floating Below Header) */}
      <aside className="fixed left-[10px] top-[84px] bottom-[10px] w-[260px] bg-white dark:bg-[#1F2937] border-theme rounded-2xl shadow-xl z-30 flex flex-col transition-colors duration-300">

        <nav className="flex-1 overflow-hidden py-2 px-3">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-1">
              {group.title && (
                <div className="flex items-center px-3 mb-1 mt-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    {group.title}
                  </h3>
                  <div className="flex-1 h-[1px] bg-gray-100 dark:bg-gray-800 ml-2"></div>
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${activePage === item.id
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                      }`}
                  >
                    <item.icon size={18} strokeWidth={2} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* FIXED Top Navigation Bar (Full Width Aligned) */}
      <header className="fixed top-[10px] left-[10px] right-[10px] h-16 bg-white/80 dark:bg-gray-800/90 backdrop-blur-md border-theme z-40 px-6 flex items-center justify-between transition-colors duration-300 rounded-2xl shadow-floating">

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-900/20">
            <Leaf className="text-white" size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-base font-bold text-green-700 dark:text-green-500 tracking-tight">Fresh Sarura</h1>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Export & Farmer Hub</p>
          </div>
        </div>

        {/* Centered Search Box */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search batches, farmers, exports..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F3F6F0] border-theme focus:outline-none focus:ring-2 focus:ring-[#66BB6A] text-sm dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />



          {/* Notification Icon */}
          <button className="relative p-2.5 rounded-xl bg-white/80 hover:bg-[#4CAF50] hover:text-white transition-all shadow-sm dark:bg-gray-700/50 dark:text-gray-200 dark:hover:bg-green-600">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#4CAF50] rounded-full ring-2 ring-white dark:ring-gray-800"></span>
          </button>

          {/* User Avatar & Profile */}
          <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-700">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-[#222222] dark:text-white">Operations Manager</p>
              <p className="text-xs text-[#6B7280] dark:text-gray-400">Unified Ops</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] flex items-center justify-center text-white text-sm font-semibold shadow-md">
              OM
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area (Adjusted for Header/Sidebar with Gap) */}
      <main className="fixed top-[84px] left-[280px] right-[10px] bottom-[10px] overflow-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-200 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-700">
        {activePage === 'home' && (
          <div className="p-6">
            {/* Summary Cards */}
            <div className="mb-6">
              <DashboardStats
                todaysIntake={`${currentIntake.toLocaleString()} kg`}
                qualityGrade={qualityGrade}
                scheduledExports={`${(scheduledExports / 1000).toLocaleString()} Tons`}
              />
            </div>

            {/* Quick Actions Grid */}
            <QuickActionsGrid
              onLogIntake={handleLogIntake}
              onQCInspection={handleQCInspection}
              onCreateShipment={handleCreateShipment}
              onFindBatch={handleFindBatch}
            />

            {/* Log Intake Drawer */}
            <LogIntakeForm
              isOpen={isIntakeOpen}
              onClose={() => setIsIntakeOpen(false)}
              onSubmit={handleIntakeSubmit}
            />



            {/* Create Shipment Drawer */}
            <CreateShipmentForm
              isOpen={isShipmentOpen}
              onClose={() => setIsShipmentOpen(false)}
              onSubmit={handleShipmentSubmit}
            />

            {/* Find Batch Drawer */}
            <FindBatchDrawer
              isOpen={isTraceabilityOpen}
              onClose={() => setIsTraceabilityOpen(false)}
            />

            {/* Charts Section */}
            <div className="grid grid-cols-3 gap-6">
              {/* Intake vs. Export Target - Large */}
              <div className="col-span-2">
                <ExportTrendsChart />
              </div>

              {/* QC Results Chart - Small */}
              <div className="col-span-1">
                <QCResultsChart />
              </div>
            </div>

            {/* Loss Analytics and Recent Activity */}
            <div className="grid grid-cols-3 gap-6 mt-6">
              {/* Loss Analytics Chart */}
              <div className="col-span-1">
                <LossAnalyticsChart />
              </div>

              {/* Recent Activity Table */}
              <div className="col-span-2">
                <RecentActivityTable />
              </div>
            </div>
          </div>
        )}

        {activePage === 'farmers' && <FarmerManagement />}

        {activePage === 'batches' && <InventoryManagement />}

        {activePage === 'qc' && <QualityControl onPerformInspection={handleQCInspection} />}

        {activePage === 'logistics' && <Logistics onCreatePackingList={handleCreatePackingList} />}

        {activePage === 'crop-planning' && <CropPlanning />}

        {activePage === 'traceability' && <Traceability />}

        {activePage === 'analytics' && <AnalyticsReporting />}

        {activePage === 'admin' && <SettingsPage />}

        {activePage !== 'home' && activePage !== 'farmers' && activePage !== 'batches' && activePage !== 'qc' && activePage !== 'logistics' && activePage !== 'crop-planning' && activePage !== 'traceability' && activePage !== 'analytics' && activePage !== 'admin' && (
          <div className="p-6 flex items-center justify-center h-full">
            <p className="text-[#6B7280] text-lg">Coming Soon...</p>
          </div>
        )}

        {/* QC Inspection Drawer - Upgraded */}
        <QCInspectionDrawer
          isOpen={isQCOpen}
          onClose={() => setIsQCOpen(false)}
          onSubmit={handleQCSubmit}
          onConfirm={() => { }}
        />

        {/* Packing List Drawer */}
        <CreatePackingListDrawer
          isOpen={isPackingListOpen}
          onClose={() => setIsPackingListOpen(false)}
          onSubmit={handlePackingListSubmit}
        />
      </main>
    </div>
  );
}

export default App;
