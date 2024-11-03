import React, { useState } from 'react';

const BuyCustom = ({ onPlaceOrder }) => {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        address: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userDetails.name && userDetails.email && userDetails.address) {
            onPlaceOrder(userDetails); // Pass user details to the parent component
            alert('Order placed successfully!');
            setUserDetails({ name: '', email: '', address: '' }); // Clear form
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <div>
            <h2>Place Your Order</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={userDetails.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userDetails.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={userDetails.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Place Order</button>
            </form>
        </div>
    );
};

export default BuyCustom;
