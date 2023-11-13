import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import './index.css'
import Invoices from './Invoices.jsx';
import InvoiceDetails from './InvoiceDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    // element: <App/> // for add pdf purposes
    element: <App/>
  },
  {
    path: "/invoices",
    element: <Invoices/>
  },
  {
    path: "/invoice/:id",
    element: <InvoiceDetails/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
