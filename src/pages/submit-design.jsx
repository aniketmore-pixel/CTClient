import React, { useState } from 'react';
import './CSS/SubmitDesign.css';
import ExampleImage from './CSS/example-image.png'; // Import the image

const SubmitDesign = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [margin, setMargin] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); // State for toast message
  const basePrice = 300;

  const handleFile = (file) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!image || !title || !name || !email || !phone) {
      setToastMessage('Please fill in all fields and upload a design.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    if (!validateEmail(email)) {
      setToastMessage('Please enter a valid email address.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    if (phone.length !== 10) {
      setToastMessage('Phone number must be exactly 10 digits.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    if (margin < 0 || margin > 350) {
      setToastMessage('Margin must be between ₹0 and ₹350.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    // Upload image first
    let imageUrl = '';
    if (image) {
      const formDataImage = new FormData();
      formDataImage.append('my_file', image);

      // Upload image to Cloudinary
      const responseImage = await fetch('http://localhost:5000/api/admin/products/upload-image', {
        method: 'POST',
        body: formDataImage,
      });

      if (responseImage.ok) {
        const resultImage = await responseImage.json();
        imageUrl = resultImage.result.url; // Get the uploaded image URL
      } else {
        setToastMessage('Failed to upload image. Please try again.');
        setTimeout(() => setToastMessage(''), 3000);
        return;
      }
    }

    const formData = {
      title,
      design: imageUrl, // Use the uploaded image URL
      name,
      email,
      phone,
      margin,
    };

    // Submit the design submission
    try {
      const response = await fetch('http://localhost:5000/api/submit-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setToastMessage('Design submitted successfully!');

        // Reset form fields after successful submission
        setTitle('');
        setImage(null);
        setPreview(null);
        setName('');
        setEmail('');
        setPhone('');
        setMargin(0);
      } else {
        throw new Error('Failed to submit design. Please try again.');
      }
    } catch (error) {
      setToastMessage(error.message || 'An error occurred.');
    } finally {
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return (
    <div className='submit-design-container'>
      {toastMessage && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
      <div className='info-section'>
        <h1>Getting Started</h1>
        <p id='info-ka-data1'>Are you a designer, brand, agency, or start-up wanting to create t-shirts? We understand that it can be challenging—finding a reliable print shop, managing inventory, and handling customer service can be overwhelming.</p>
        <p id='info-ka-data2'>What if you could showcase your designs in a high-quality online shop without the hassle? No upfront costs, no inventory, and no shipping responsibilities—sounds great, right?</p>
        <p id='info-ka-data3'>That's where we come in. Upload, design, and launch your own products on demand or as a pre-order campaign—it's your choice!</p>
        <p id='info-ka-data4'><i>*As long as you’ve been on CustomTees before, you can launch your own shirts. If you’re new to CustomTees, we’ll still need to take a quick look before your shirt or other product is available for sale.</i></p>

        {/* Add image below the text */}
        <img src={ExampleImage} alt="Example design" className="info-image" />
      </div>

      <div className='form-section'>
        <h1>Submit Your Design</h1>
        <form onSubmit={handleSubmit} className='design-form'>
          <label id='naav'>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </label>

          <label id='emailxx'>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>

          <label id='phoneno'>
            Phone:
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </label>

          <label id='design'>
            Design Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter design title"
              required
            />
          </label>

          <div
            className={`drop-zone ${dragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="image-preview" />
            ) : (
              <p>Drag & Drop your design here or click to upload</p>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
          </div>

          <label id='margin'>
            Set Margin (₹):
            <input
              type="number"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              placeholder="Set your margin"
              min="0"
              max="350"
            />
          </label>

          <p style={{ color: "white" }}>Base Price: ₹{basePrice}</p>
          <p style={{ color: "white" }}>Final Price: ₹{basePrice + parseInt(margin)}</p>


          <button id="submit-wala-button" type="submit">Submit Design</button>
        </form>
      </div>
    </div>
  );
};

export default SubmitDesign;
