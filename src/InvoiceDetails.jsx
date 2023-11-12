import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/config';
import { forms } from './constants/constants';

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
  }, [id, invoiceData]); // Fetch data whenever the ID changes

  return (
    <div>
      {
        invoiceData ? (
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
                  <div
                    style={{
                      marginTop: '50px',
                      textAlign: 'left',
                      lineHeight: '0.5'
                    }}
                  >
                    <p>Lot 3, No. 3,</p>
                    <p>Ground Floor, Putatan New Township,</p>
                    <p>88200 Putatan,</p>
                    <p>Sabah</p>
                    <p>Phone: +60 13-545 7674</p>
                    <p>Email: gnt.electrical.eng@gmail.com</p>
                  </div>
              </div>
              <div>
                  <h2 style={{color: 'navy'}}>{invoiceData.selectedForm}</h2>
                  <div
                    style={{
                      marginTop: '50px',
                      textAlign: 'left',
                      lineHeight: '0.5'
                    }}
                  >
                    <p>{invoiceData.selectedForm == forms[0] ? forms[0] : "INVOICE"}# <u>{invoiceData.id}</u></p>
                    <p>DATE <u style={{marginLeft: '30px'}}>{invoiceData.createdAt}</u></p>
                  </div>
              </div>
            </div>
            <div>
              <div className='receiver'
                style={{
                  textAlign: 'left',
                  lineHeight: '0.5'
                }}
              >
                <p>To</p>
                <p>{invoiceData.company}</p>
                <p>{invoiceData.address}</p>
                <p>CC: {invoiceData.cc ? invoiceData.cc : '-'}</p>
              </div>
            </div>
            <div>
              <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Description</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Amount</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Quantity</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    invoiceData.items.map((item, index) => (
                      <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#cceeff' : 'white' }}>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{item.description}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.price}.00</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{parseInt(item.price) * parseInt(item.quantity)}.00</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <div
                style={{
                  textAlign: 'left',
                  padding: '10px'
                }}
              >
                <small>Make all payments to GNT ELECTRICAL ENGINEERING, Hong Leong Islamic Bank: 11101004409</small>
              </div>
            </div>
            <div className='signature'
              style={{
                marginTop: '100px'
              }}
            >
              <table style={{ width: '100%', marginTop: '20px',}}>
              <thead>
                  <tr>
                    <th style={{ border: 'none', padding: '8px', textAlign: 'center', width: '30%'}}>GNT ELECTRICAL</th>
                    <th style={{ border: 'none', padding: '8px', textAlign: 'center',width: '30%' }}></th>
                    <th style={{ border: 'none', padding: '8px', textAlign: 'center', width: '30%' }}>CUSTOMER SIGNATURE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left', height: '100px' }}></td>
                    <td style={{ borderBottom: 'none', borderLeft: 'none', borderRight: 'none', padding: '8px', textAlign: 'center' }}></td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (<div>Loading...</div>)
      }
    </div>
  );
};

export default InvoiceDetails;
