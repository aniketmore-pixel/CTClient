import React, { useState } from 'react';

// Order Modal Component
const OrderModal = ({ isOpen, onClose, frontScreenshot, backScreenshot, onOrder }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onOrder({ name, address, frontScreenshot, backScreenshot });
        onClose(); // Close the modal after submitting
    };

    if (!isOpen) return null;

    return (
        <div style={modalOverlayStyle}>
            <div style={modalStyle}>
                <h2>Order Your T-shirt</h2>
                <h3>Preview:</h3>
                <img src={frontScreenshot} alt="Front View" style={imageStyle} />
                <img src={backScreenshot} alt="Back View" style={imageStyle} />
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Name:
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                style={inputStyle}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Address:
                            <textarea 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)} 
                                required 
                                style={inputStyle}
                            />
                        </label>
                    </div>
                    <button type="submit" style={orderButtonStyle}>Place Order</button>
                </form>
                <button onClick={onClose} style={closeButtonStyle}>Close</button>
            </div>
        </div>
    );
};

export default OrderModal;

// Styles for modal and overlay
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
};

const imageStyle = {
    width: '300px',
    height: 'auto',
    margin: '10px',
};

const closeButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

const orderButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
};


