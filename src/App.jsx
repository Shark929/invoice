import { useState, useEffect } from 'react'
import './App.css'
import {db} from './firebase/config'
import { getDocs, collection, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { forms, options } from './constants/constants';
import { auth } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useMediaQuery } from 'react-responsive';
import  delIcon from './assets/delete.png';

function App() {
  const currentDate = new Date();
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [cc, setCC] = useState('');
  const [documentIdCounter, setDocumentIdCounter] = useState(1);
  const navigate = useNavigate();
  const [selectedForm, setSelectedForm] = useState(forms[0]);
 
  const [userId, setUserId] = useState(null);
  const optionsArray = Object.values(options);
  const [selectedOption, setSelectedOption] = useState('');
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })

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
      const formattedDocumentId = String(documentIdCounter).padStart(4, '0');
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            setUserId(uid);
            console.log("uid", uid);
        } else {
            // User is signed out
            // ...
            navigate('/login');
            console.log("user is logged out");
        }
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
}, []);

  const handleLogout = () => {               
    signOut(auth).then(() => {
    // Sign-out successful.
        navigate("/login");
        console.log("Signed out successfully")
    }).catch((error) => {
    // An error happened.
    console.log(error);
    });
  }

  const handleOptionChange = (event) => {
    const selectedOptionId = event.target.value;
  const selectedOptionDetails = options.find((option) => option.description === selectedOptionId);

  if (selectedOptionDetails) {
    // Set values based on the selected option
    setDescription(selectedOptionDetails.description);
    setPrice(selectedOptionDetails.price.toString());
    setQuantity(selectedOptionDetails.quantity.toString());
    setSelectedOption(selectedOptionDetails);
  } else {
    // Clear values if the selected option is not found
    setDescription("");
    setPrice("");
    setQuantity("");
    setSelectedOption(null);
  }
  };

  return (
    userId ? <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: 'space-between'
        }}>
        <div
           style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {
            isDesktopOrLaptop ? <h1>GNT Invoice System {getDate()}</h1> : <p>GNT Invoice System {getDate()}</p>
          }
          {
            isDesktopOrLaptop ? <button 
            style={{
              backgroundColor: '#4DA9FF',
              border: 'none',
              borderRadius: '5px',
              width: '150px',
              padding: '10px',
              marginLeft: '10px'
            }}
            onClick={handleNavigate}
          >Go to Invoices</button> : <div></div>
          }
        </div>
        <div>
          <button
            style={{
              backgroundColor: '#FF4747',
              border: 'none',
              borderRadius: '5px',
              width: '150px',
              padding: '10px',
              marginLeft: '10px'
            }} 
            onClick={handleLogout}
          >Logout</button>
        </div>
      </div>
      {
        isDesktopOrLaptop ? <div></div> : <button 
        style={{
          backgroundColor: '#4DA9FF',
          border: 'none',
          borderRadius: '5px',
          width: '150px',
          padding: '10px',
          marginLeft: '10px',
          marginBottom: '20px',
          marginTop: '50px'
        }}
        onClick={handleNavigate}
      >Go to Invoices</button>
      }
      <div
        className='user-input'
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
        <div
          className='options'
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <label style={{width: isDesktopOrLaptop ? '180px' : '130px', textAlign: 'left'}} htmlFor="formSelect">Select Form:</label>
          <select 
            id="formSelect" 
            value={selectedForm} 
            onChange={handleFormChange}
            style={{
              padding: '10px', width: '205px'
            }}
          >
            <option value="" disabled>Select a form</option>
            {forms.map((form, index) => (
              <option key={index} value={form}>
                {form}
              </option>
            ))}
          </select>
        </div>
        <br/>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <label style={{width: isDesktopOrLaptop ? '180px' : '130px', textAlign: 'left'}}>Company</label>
          <input style={{padding: '10px', width: '180px'}} value={company} type="text" placeholder="Company" onChange={(e) => setCompany(e.target.value)} />
        </div>
        <br/>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <label style={{width: isDesktopOrLaptop ? '180px' : '130px', textAlign: 'left'}}>Address</label>
          <textarea style={{padding: '10px', width: '180px'}} value={address} type="text" placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
        </div>
        <br/>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <label style={{width: isDesktopOrLaptop ? '180px' : '130px', textAlign: 'left'}}>CC</label>
          <input style={{padding: '10px', width: '180px'}} value={cc} type="text" placeholder="CC" onChange={(e) => setCC(e.target.value)} />
        </div>
        <br/>
        <div
          className='options'
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <label style={{width: isDesktopOrLaptop ? '180px' : '130px', textAlign: 'left'}} htmlFor="options">Options:</label>
          <select 
            id="options" 
            value={selectedOption} 
            onChange={handleOptionChange}
            style={{
              padding: '10px', width: '205px'
            }}
          >
            <option value="" disabled>{optionsArray[0].description}</option>
            {optionsArray.map((option) => (
              <option key={option.id} value={option.description}>
                {option.description}
              </option>
            ))}
          </select>
        </div>
        <br/>
        <form 
          style={isDesktopOrLaptop ? {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          } : {}}
          onSubmit={(e) => { e.preventDefault(); addItem(); }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <label style={{width: isDesktopOrLaptop ? '180px' : '130px', textAlign: 'left'}}>Description</label>
            <input style={{padding: '10px', width: '180px'}} value={description} type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
          </div>
          {isDesktopOrLaptop ? <div></div> : <br/>}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <label style={{width: isDesktopOrLaptop ? '180px' : '130px', textAlign: isDesktopOrLaptop ? 'center' : 'left'}}>Price</label>
            <input style={{padding: '10px', width: '180px'}} value={price} type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
          </div>
          {isDesktopOrLaptop ? <div></div> : <br/>}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <label style={{width: isDesktopOrLaptop ? '180px' : '130px', textAlign: isDesktopOrLaptop ? 'center' : 'left'}}>Quantity</label>
            <input style={{padding: '10px', width: '180px'}} value={quantity} type="number" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
          </div>
          {isDesktopOrLaptop ? <div></div> : <br/>}
          <button
            style={{
              backgroundColor: '#4DA9FF',
              border: 'none',
              borderRadius: '5px',
              width: '120px',
              padding: '10px',
              marginLeft: '10px'
            }}
          >Add</button>
        </form>
      </div>

      <div
        className='data-table'
        style={{
          padding: '20px',
          backgroundColor: '#D9D9D9',
          width: '100%',
          marginTop: '20px',
        }}
      >
        <div
          className='receiver'
          style={{
            textAlign: 'left'
          }}
        >
          To: 
          <br/>
          {company}
          <br/>
          {address}
          <br/>
          CC: {cc != '' ? cc : '-'}
        </div>
        <div
          className='table'
        >
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
                items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{item.description}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.price}.00</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{parseInt(item.price) * parseInt(item.quantity)}.00</td>
                    <button style={{border: 'none', backgroundColor: 'transparent'}} onClick={() => removeItem(item.id)}><img alt='delete-icon' src={delIcon} width={24} height={24}/></button>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      <div
        className='grand-total'
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <h3>Grand Total: RM{grandTotal}.00</h3>
      </div>
      <button
        style={{
          backgroundColor: '#4DA9FF',
          border: 'none',
          borderRadius: '5px',
          width: '150px',
          padding: '10px',
          marginLeft: '10px'
        }}
        onClick={saveToFirebase}
      >
        Submit
      </button>
    </> : <div></div>
  )
}

export default App
