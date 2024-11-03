import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useToast } from "@/components/ui/use-toast";
import './CSS/design-submissions.css';
import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/config";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import {
  addNewProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

const DesignSubmissions = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();

  const { toast } = useToast();

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/design-submissions');
        setDesigns(response.data.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        })
      ).then((data) => {
        console.log(data, "edit");

        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
        }
      })
      : dispatch(
        addNewProduct({
          ...formData,
          image: uploadedImageUrl,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          toast({
            title: "Product added successfully",
          });
        }
      });
  }

  const handleRejectDesign = async (designId) => {
    try {
      await axios.delete(`http://localhost:5000/api/design-submissions/${designId}`);
      setDesigns(prevDesigns => prevDesigns.filter(design => design._id !== designId));
      toast({
        title: 'Design Rejected',
        variant: 'success', // Use variant if your toast system supports it
      });
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <Fragment>
      <div className="design-submissions-container">
        <h1>Design Submissions</h1>
        {designs.length === 0 ? (
          <p>No design submissions available.</p>
        ) : (
          <div className="design-cards">
            {designs.map(design => (
              <div key={design._id} className="design-card">
                <h2>{design.title}</h2>
                <p><strong>Name:</strong> {design.name}</p>
                <p><strong>Email:</strong> {design.email}</p>
                {design.design && (
                  <img src={design.design} alt={design.title} className="design-image" />
                )}
                <p><strong>Phone:</strong> {design.phone}</p>
                <p><strong>Margin:</strong> {design.margin}</p>
                <Button
                  onClick={() => {
                    setFormData({
                      ...initialFormData,
                      title: design.title,
                      image: design.design, // set the image in formData
                    });
                    setUploadedImageUrl(design.design); // set the URL to display in ProductImageUpload
                    setOpenCreateProductsDialog(true);
                  }}
                  className="create-product-btn"
                >
                  Create Product
                </Button>

                <Button onClick={() => handleRejectDesign(design._id)} className="reject-button">
                  Reject
                </Button>
              </div>
            ))}
          </div>
        )}
        <ToastContainer />

        {/* Sheet Component for Create Product */}
        <Sheet
          open={openCreateProductsDialog}
          onOpenChange={setOpenCreateProductsDialog}
        >
          <SheetContent side="right" className="overflow-auto">
            <SheetHeader>
              <SheetTitle>Create a product from design</SheetTitle>
            </SheetHeader>

            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isEditMode={currentEditedId !== null}
            />

            <div className="py-6">
              <CommonForm
                onSubmit={onSubmit}
                formData={formData}
                setFormData={setFormData}
                buttonText={currentEditedId !== null ? "Edit" : "Add"}
                formControls={addProductFormElements}
                isBtnDisabled={!isFormValid()}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </Fragment>
  );
};

export default DesignSubmissions;
