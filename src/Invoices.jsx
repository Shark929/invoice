import {useState, useEffect} from 'react'
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "./firebase/config";
import { useNavigate } from 'react-router-dom';
import { forms } from './constants/constants';

const Invoices = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch data from Firebase Firestore
    const fetchData = async () => {
      const q = query(collection(db, 'invoices'));
      const querySnapshot = await getDocs(q);
      const invoices = [];
      querySnapshot.forEach((doc) => {
        // Include the document ID along with the document data
        invoices.push(doc);
      });
      setData(invoices);
    };

    fetchData();
  }, []);

  const handleClick = (doc) => {
    // Use the auto-generated document ID for navigation
    navigate(`/invoice/${doc.id}`);
    console.log(`Navigating to invoice with Firebase document ID: ${doc.id}`);
  };

  const calculateTotalGrandTotal = () => {
    // Calculate the total of grandTotal where selectedForm is "INVOICE" or "CASH"
    return data.reduce((total, doc) => {
      if (doc.data().selectedForm === forms[1]) {
        return total + doc.data().grandTotal;
      }
      return total;
    }, 0);
  };

  const sortedData = [...data].sort((a, b) => {
    // Assuming `id` is a number; if it's a string, you might need to adjust the comparison
    return a.data().id - b.data().id;
  });

  // Filter data based on the search query
  const filteredData = sortedData.filter((doc) =>
    doc.data().company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const slicedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          style={{
            margin: '0 5px',
            padding: '5px 10px',
            backgroundColor: currentPage === i ? '#4DA9FF' : 'inherit',
            color: currentPage === i ? 'white' : 'inherit',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button 
          style={{
            backgroundColor: '#4DA9FF',
              border: 'none',
              borderRadius: '5px',
              width: '150px',
              padding: '10px',
              marginRight: '10px'
          }}
          onClick={()=>{navigate('/')}}>
            Home
          </button>
          <p>Total Sales: <h3>RM {calculateTotalGrandTotal()}.00</h3></p>
        <h1>Documents</h1>
      </div>
      
      <input
        style={{padding: '10px', width: '180px'}} 
        type="text"
        placeholder="Search by company..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
         <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Id</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Forms</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Company</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Grand Total (RM)</th>
          </tr>
        </thead>
        <tbody>
          {slicedData.map((doc) => (
            <tr
              style={{
                display: doc.data().company.toLowerCase().includes(searchQuery.toLowerCase()) ? 'table-row' : 'none',
                backgroundColor: doc.data().selectedForm === forms[1] ? 'green' : 'inherit',
                color: doc.data().selectedForm === forms[1] ? 'white' : 'inherit',
              }}
              key={doc.id}
              onClick={() => handleClick(doc)}
            >
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{doc.data().id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{doc.data().selectedForm}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{doc.data().company}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{doc.data().grandTotal}.00</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        {renderPaginationButtons()}
      </div>
    </div>
  )
}

export default Invoices