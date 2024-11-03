import { useSelector } from "react-redux";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);
  const billRef = useRef();
  const [loading, setLoading] = useState(false);

  // Function to generate and download the PDF
  const handleDownloadPDF = async () => {
    try {
      setLoading(true);

      // Capture the content of the bill with scaling and extra padding
      const canvas = await html2canvas(billRef.current, {
        scale: 1, // Slight zoom out
        backgroundColor: "#ffffff", // Set background color to white for clarity
        x: -10, // Adjust left margin
        y: 15, // Adjust top margin
        width: billRef.current.offsetWidth + 20,
        height: billRef.current.offsetHeight + 20,
      });
      const imgData = canvas.toDataURL("image/png");

      // Create a new PDF document with dimensions matching the canvas
      const pdfWidth = canvas.width / 2;
      const pdfHeight = canvas.height / 2;
      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? 'p' : 'l',
        unit: "px",
        format: [pdfWidth, pdfHeight + 20], // Extra space for title at the top
      });

      // Add the title at the top
      pdf.setFontSize(16);
      pdf.text("CustomTees", pdfWidth / 2, 30, { align: "center" });

      // Add the bill image below the title
      pdf.addImage(imgData, "PNG", 0, 30, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");

      toast.success("PDF has been downloaded successfully!");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Error generating PDF: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="font-medium text-center text-lg">CustomTees</div>
        <Separator />
        <div ref={billRef} className="grid gap-6 p-4 bg-white">
          {/* Order Info */}
          <div className="grid gap-2">
            <div className="flex mt-6 items-center justify-between">
              <p className="font-medium">Order ID</p>
              <Label>{orderDetails?._id}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Date</p>
              <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Price</p>
              {/* <Label>₹{orderDetails?.totalAmount * 84}</Label> */}
              <Label>₹{(orderDetails?.totalAmount * 84).toFixed(2)}</Label>

            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment Method</p>
              <Label>{orderDetails?.paymentMethod}</Label>
            </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Payment Status</p>
              <Label>{orderDetails?.paymentStatus}</Label>
            </div>
          </div>

          <Separator />

          {/* Cart Items */}
          <div className="grid gap-4">
            <div className="font-medium">Cart Items</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <span>Qty: {item.quantity}</span>
                  {/* <span>Price: ₹{item.price * 84}</span> */}
                  <span>Price: ₹{(item.price * 84).toFixed(2)}</span>

                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Shipping Info */}
          <div className="grid gap-4">
            <div className="font-medium">Shipping Info</div>
            <div>
              <span>{user.userName}</span>
              <div>{orderDetails?.addressInfo?.address}</div>
              <div>{orderDetails?.addressInfo?.city}</div>
              <div>{orderDetails?.addressInfo?.pincode}</div>
              <div>{orderDetails?.addressInfo?.phone}</div>
              <div>{orderDetails?.addressInfo?.notes}</div>
            </div>
          </div>
        </div>

        {/* Download PDF Button */}
        <div className="flex justify-center">
          <Button onClick={handleDownloadPDF} disabled={loading}>
            {loading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
