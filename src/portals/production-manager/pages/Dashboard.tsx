import DashboardStats from '../components/DashboardStats';
import QuickActionsGrid from '../components/QuickActionsGrid';
import LogIntakeModal from '../components/LogIntakeModal';
import CreateShipmentModal from '../components/CreateShipmentModal';
import FindBatchModal from '../components/FindBatchModal';
import ExportTrendsChart from '../components/ExportTrendsChart';
import QCResultsChart from '../components/QCResultsChart';
import LossAnalyticsChart from '../components/LossAnalyticsChart';
import RecentActivityTable from '../components/RecentActivityTable';

interface DashboardProps {
    currentIntake: number;
    qualityGrade: string;
    scheduledExports: number;
    isIntakeOpen: boolean;
    isShipmentOpen: boolean;
    isTraceabilityOpen: boolean;
    onLogIntake: () => void;
    onQCInspection: () => void;
    onCreateShipment: () => void;
    onFindBatch: () => void;
    onCloseIntake: () => void;
    onIntakeSubmit: (weight: number) => void;
    onCloseShipment: () => void;
    onShipmentSubmit: (weight: number) => void;
    onCloseTraceability: () => void;
}

const Dashboard = ({
    currentIntake,
    qualityGrade,
    scheduledExports,
    isIntakeOpen,
    isShipmentOpen,
    isTraceabilityOpen,
    onLogIntake,
    onQCInspection,
    onCreateShipment,
    onFindBatch,
    onCloseIntake,
    onIntakeSubmit,
    onCloseShipment,
    onShipmentSubmit,
    onCloseTraceability
}: DashboardProps) => {
    return (
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
                onLogIntake={onLogIntake}
                onQCInspection={onQCInspection}
                onCreateShipment={onCreateShipment}
                onFindBatch={onFindBatch}
            />

            {/* Log Intake Modal */}
            <LogIntakeModal
                isOpen={isIntakeOpen}
                onClose={onCloseIntake}
                onSubmit={onIntakeSubmit}
            />

            {/* Create Shipment Modal */}
            <CreateShipmentModal
                isOpen={isShipmentOpen}
                onClose={onCloseShipment}
                onSubmit={onShipmentSubmit}
            />

            {/* Find Batch Modal */}
            <FindBatchModal
                isOpen={isTraceabilityOpen}
                onClose={onCloseTraceability}
            />

            {/* Charts Section */}
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <ExportTrendsChart />
                </div>
                <div className="col-span-1">
                    <QCResultsChart />
                </div>
            </div>

            {/* Loss Analytics and Recent Activity */}
            <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="col-span-1">
                    <LossAnalyticsChart />
                </div>
                <div className="col-span-2">
                    <RecentActivityTable />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
