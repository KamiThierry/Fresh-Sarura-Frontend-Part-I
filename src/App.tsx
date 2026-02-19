import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductionManagerRoutes from './portals/production-manager/ProductionManagerRoutes';
import FarmManagerRoutes from './portals/farm-manager/FarmManagerRoutes';
import LogisticsRoutes from './portals/logistics-officer/LogisticsRoutes';
import DriverTaskView from './portals/driver/pages/DriverTaskView';

function App() {
  return (
    <Router>
      <Routes>
        {/* Farm Manager Portal */}
        <Route path="/farm-manager/*" element={<FarmManagerRoutes />} />

        {/* Production Manager Portal */}
        <Route path="/*" element={<ProductionManagerRoutes />} />

        {/* Logistics Officer Portal */}
        <Route path="/logistics/*" element={<LogisticsRoutes />} />

        {/* Driver Lite Interface */}
        <Route path="/driver/task/:taskId" element={<DriverTaskView />} />
      </Routes>
    </Router>
  );
}

export default App;
