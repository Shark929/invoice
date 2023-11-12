import { useState, useEffect } from 'react'
import './App.css'
import {db} from './firebase/config'
import { getDocs, collection, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { forms } from './constants/constants';

function App() {
  const currentDate = new Date();
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [cc, setCC] = useState('');
  const [documentIdCounter, setDocumentIdCounter] = useState(150);
  const navigate = useNavigate();
  const [selectedForm, setSelectedForm] = useState(forms[0]);

  const handleFormChange = (event) => {
    setSelectedForm(event.target.value);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, 'invoices'), orderBy('id', 'desc'), limit(1))
        );

        const lastDocument = querySnapshot.docs[0];

        if (lastDocument) {
          // Extract the numeric part of the ID and increment it
          const lastDocumentId = parseInt(lastDocument.data().id.slice(4), 10);
          setDocumentIdCounter(lastDocumentId + 1);
        }
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    };

    fetchDocuments();
  }, []); // Run this effect only once on component mount


  //a function to add the input into an object
  const addItem = () => {
    // Check if all fields are filled before adding the item
    if (description && price && quantity) {
      const newItem = {
        id: new Date().getTime(), // Unique ID for each item (using timestamp for simplicity)
        description,
        price,
        quantity,
      };

      // Update the items array with the new item
      setItems([...items, newItem]);

      // Clear the input fields
      setDescription("");
      setPrice("");
      setQuantity("");
    } else {
      // You can add some validation or error handling here
      console.log("Please fill in all fields");
    }
  };
  
  // Function to remove an item from the items array
  const removeItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
  };

  // Calculate the total for each item
  const calculateTotal = (item) => {
    return item.price * item.quantity;
  };

   // Calculate the grand total
   const grandTotal = items.reduce((total, item) => total + calculateTotal(item), 0);

  const getDate = () => {
    return `${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}`;
  }

  const saveToFirebase = async (e) => {
    e.preventDefault();

    try {
      // Format the document ID with leading zeros
      const formattedDocumentId = String(documentIdCounter).padStart(7, '0');
      const documentId = `0000${formattedDocumentId}`;

      const docRef = await addDoc(collection(db, "invoices"), {
        id: documentId,
        company,
        address,
        cc,
        items,
        grandTotal,
        createdAt: getDate(),
        selectedForm,
      }).then(() => {
        setAddress("");
        setCC("");
        setCompany("");
        setDescription("");
        setItems([]);
        setPrice("");
        setQuantity("");
        alert("Your invoice has been saved successfully!");
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  const handleNavigate = () => {
    navigate('/invoices');
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}>
        <h1>GNT {getDate()}</h1>
        <div>
          <button onClick={handleNavigate}>Go to Invoices</button>
        </div>
      </div>
      <label htmlFor="formSelect">Select Form:</label>
      <select id="formSelect" value={selectedForm} onChange={handleFormChange}>
        <option value="" disabled>Select a form</option>
        {forms.map((form, index) => (
          <option key={index} value={form}>
            {form}
          </option>
        ))}
      </select>
      <br/>
      <input value={company} type="text" placeholder="Company" onChange={(e) => setCompany(e.target.value)} />
      <br/>
      <br/>
      <textarea value={address} type="text" placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
      <br/>
      <input value={cc} type="text" placeholder="CC" onChange={(e) => setCC(e.target.value)} />
      <br/>
      <form onSubmit={(e) => { e.preventDefault(); addItem(); }}>
        <input value={description} type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
        <input value={price} type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
        <input value={quantity} type="number" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
        <button>Add</button>
      </form>

      <ul>
       To: {company}
       <br/>
        Address: {address}
        <br/>
      CC: {cc != '' ? cc : '-'}
      <br/>
        {items.map((item) => (
          <div key={item.id}>
            {item.description} - ${item.price} - {item.quantity}- Total: ${calculateTotal(item)}
            <button onClick={() => removeItem(item.id)}>Delete</button>
          </div>
        ))}
       Grand Total: RM{grandTotal}.00
      </ul>

      <button onClick={saveToFirebase}>Submit</button>
    </>
  )
}

export default App
