import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';

import FarmerManagement from './pages/FarmerManagement';
import InventoryManagement from './pages/InventoryManagement';
import QualityControl from './pages/QualityControl';
import Logistics from './pages/Logistics';
import CreatePackingListModal from './components/CreatePackingListModal';
import CropPlanning from './pages/CropPlanning';
import Traceability from './pages/Traceability';
import AnalyticsReporting from './pages/AnalyticsReporting';
import SettingsPage from './pages/Settings';

import QCInspectionModal from './components/QCInspectionModal';

const ProductionManagerRoutes = () => {
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

    return (
        <>
            <Routes>
                <Route element={<Layout />}>
                    {/* Home/Dashboard Route */}
                    <Route
                        path="/"
                        element={
                            <Dashboard
                                currentIntake={currentIntake}
                                qualityGrade={qualityGrade}
                                scheduledExports={scheduledExports}
                                isIntakeOpen={isIntakeOpen}
                                isShipmentOpen={isShipmentOpen}
                                isTraceabilityOpen={isTraceabilityOpen}
                                onLogIntake={handleLogIntake}
                                onQCInspection={handleQCInspection}
                                onCreateShipment={handleCreateShipment}
                                onFindBatch={handleFindBatch}
                                onCloseIntake={() => setIsIntakeOpen(false)}
                                onIntakeSubmit={handleIntakeSubmit}
                                onCloseShipment={() => setIsShipmentOpen(false)}
                                onShipmentSubmit={handleShipmentSubmit}
                                onCloseTraceability={() => setIsTraceabilityOpen(false)}
                            />
                        }
                    />

                    {/* Other Routes */}
                    <Route path="/farmers" element={<FarmerManagement />} />
                    <Route path="/crop-planning" element={<CropPlanning />} />
                    <Route path="/inventory" element={<InventoryManagement />} />
                    <Route path="/quality-control" element={<QualityControl onPerformInspection={handleQCInspection} />} />
                    <Route path="/logistics" element={<Logistics onCreatePackingList={handleCreatePackingList} />} />
                    <Route path="/traceability" element={<Traceability />} />
                    <Route path="/analytics" element={<AnalyticsReporting />} />
                    <Route path="/settings" element={<SettingsPage />} />

                    {/* Coming Soon Route */}
                    <Route
                        path="/communication"
                        element={
                            <div className="p-6 flex items-center justify-center h-full">
                                <p className="text-[#6B7280] text-lg">Communication - Coming Soon...</p>
                            </div>
                        }
                    />

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>

            {/* Global Modals (Always available, outside Layout/Routes or inside context provider ideally) */}
            <QCInspectionModal
                isOpen={isQCOpen}
                onClose={() => setIsQCOpen(false)}
                onSubmit={handleQCSubmit}
                onConfirm={() => { }}
            />

            <CreatePackingListModal
                isOpen={isPackingListOpen}
                onClose={() => setIsPackingListOpen(false)}
                onSubmit={handlePackingListSubmit}
            />
        </>
    );
};

export default ProductionManagerRoutes;
