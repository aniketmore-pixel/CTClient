// src/components/admin-view/design-submission-tile.jsx
import React from 'react';
import { Button } from "@/components/ui/button";

const DesignSubmissionTile = ({ design, setFormData, setOpenCreateProductDialog, setCurrentDesignId, handleDelete }) => {
  const handleEdit = () => {
    setFormData({
      title: design.title,
      description: design.description,
      margin: design.margin,
      // Include any other necessary fields
    });
    setCurrentDesignId(design.id);
    setOpenCreateProductDialog(true);
  };

  return (
    <div className="border p-4 rounded">
      <h2>{design.title}</h2>
      <p>{design.description}</p>
      <p>Margin: ${design.margin}</p>
      <Button onClick={handleEdit}>Create Product</Button>
      <Button onClick={() => handleDelete(design.id)} className="bg-red-500 text-white">Delete</Button>
    </div>
  );
};

export default DesignSubmissionTile;
