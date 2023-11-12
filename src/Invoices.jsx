import {useState, useEffect} from 'react'
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "./firebase/config";
import { useNavigate } from 'react-router-dom';

const Invoices = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div>
      <h1>Invoices</h1>
      {data.map((doc) => (
        <div key={doc.id} onClick={() => handleClick(doc)}>
          {doc.data().company}
        </div>
      ))}
    </div>
  )
}

export default Invoices