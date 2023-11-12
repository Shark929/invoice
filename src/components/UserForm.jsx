import React from 'react'

const UserForm = () => {
    
  return (
    <div>
        <form>
        <input value={description} type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
        <input value={price} type="text" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
        <input value={quantity} type="text" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
        <button>Add</button>
      </form>
    </div>
  )
}

export default UserForm;