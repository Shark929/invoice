import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Invoices from './Invoices.jsx';
import InvoiceDetails from './InvoiceDetails.jsx';

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
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
