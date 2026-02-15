import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductionManagerRoutes from './portals/production-manager/ProductionManagerRoutes';
import FarmManagerRoutes from './portals/farm-manager/FarmManagerRoutes';
import LogisticsOfficerRoutes from './portals/logistics-officer/LogisticsOfficerRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Farm Manager Portal */}
        <Route path="/farm-manager/*" element={<FarmManagerRoutes />} />

        {/* Logistics Officer Portal */}
        <Route path="/logistics/*" element={<LogisticsOfficerRoutes />} />

        {/* Production Manager Portal */}
        <Route path="/*" element={<ProductionManagerRoutes />} />

        {/* Future Portals can be added here, e.g.:
        <Route path="/logistics/*" element={<LogisticsPortalRoutes />} /> 
        */}
      </Routes>
    </Router>
  );
}

export default App;
