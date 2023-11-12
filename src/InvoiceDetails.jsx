import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/config';

const InvoiceDetails = () => {
  const { id } = useParams(); // Get the invoice ID from the URL params
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const docRef = doc(db, 'invoices', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setInvoiceData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document: ', error);
      }
    };

    fetchInvoiceData();
  }, [id]); // Fetch data whenever the ID changes

  return (
    <div>
      <div
        style={{
            display:'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
        }}
      >
        <div>
            <h3>GNT ELECTRICAL ENGINEERING</h3>
        </div>
        <div>
            <p>CASH/INVOICE</p>
        </div>
      </div>
      {invoiceData ? (
        <>
          <p>Company: {invoiceData.company}</p>
          <p>Address: {invoiceData.address}</p>
          {/* Add other fields as needed */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default InvoiceDetails;
