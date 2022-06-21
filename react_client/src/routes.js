import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/dev/layout/MainLayout';
import DevLayout from 'src/dev/layout/DevLayout';
import Account from 'src/dev/pages/Account';
// import CustomerList from 'src/pages/CustomerList';
import Customers from 'src/dev/pages/Customers';
import Dashboard from 'src/dev/pages/Dashboard';
import Login from 'src/dev/pages/Login';
import NotFound from 'src/pages/NotFound';
import Products from 'src/dev/pages/Products';
import Product from 'src/dev/pages/Product';
import Register from 'src/dev/pages/Register';
import Settings from 'src/pages/Settings';
import LP from 'src/dev/pages/LP';
import MyUrls from 'src/dev/pages/MyUrls';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      // { path: 'account', element: <Account /> },
      // { path: 'customers', element: <CustomerList /> },
      // { path: 'dashboard', element: <Dashboard /> }, 
      { path: 'settings', element: <Settings /> },
      // { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: 'dev',
    element: <DevLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'customers', element: <Customers /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <Products /> },
      { path: 'myurls', element: <MyUrls /> },
      { path: 'product/:id', element: <Product /> },
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: 'dashboard', element: <Navigate to="/app/dashboard" /> },
      { path: '/', element: <LP /> },
      // { path: '*', element: <Navigate to="/" /> }
    ]
  },
];

export default routes;
