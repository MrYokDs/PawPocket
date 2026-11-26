import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { ROUTE_PATHS } from './paths';

/**
 * กำหนดเส้นทาง (Routes) ทั้งหมดของแอปพลิเคชัน MeowIncome
 * @returns โครงสร้าง Routes ของ React Router
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.DASHBOARD} element={<Dashboard />} />
      <Route path="*" element={<Navigate to={ROUTE_PATHS.DASHBOARD} replace />} />
    </Routes>
  );
}

