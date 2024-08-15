import React, { useState, useEffect } from "react";
import '../App.css'; // Ensure you have the App.css imported for styling
import cartImage from '../photos/cart.jpg'; // Import the image

function InvoiceForm() {
  const TAX_RATE = 0.0725;

  const [formData, setFormData] = useState({
    customerName: "",
    address1: "",
    unit: "",
    city: "",
    state: "",
    zipCode: "",
    cartModel: "Fleet (2 Seater) Golf Cart",
    basePrice: 6875,
    battery: "AMG batteries 150A-48 V (Standard)",
    battery_price: 0,
    paint: "Metallic/Matte Paint", // Default paint type
    paintColor: "Select Color", // Default color
    paintPrice: 60, // Default price for Metallic/Matte Paint
    addOns: [],
    totalPrice: 6875 * (1 + TAX_RATE),
  });

  const [message, setMessage] = useState(""); // State to hold the response message
  const [availableAddOns, setAvailableAddOns] = useState([]);
  const [paintOptions, setPaintOptions] = useState({
    "Metallic/Matte Paint": { price: 60, colors: ["Select Color", "Red", "Black", "White"] },
    "Chameleon Paint": { price: 360, colors: ["Select Color", "Blue", "Green", "Purple"] },
  });

  const initialAddOns = [
    { name: "Extra Speakers", price: 96 },
    { name: "Front Basket", price: 60 },
    { name: "Cooler", price: 72 },
    { name: "Sand and seed bottles", price: 24 },
    { name: "Ball Washer", price: 66 },
    { name: "Led Light Set", price: 264 },
    { name: "LED Front hood lights", price: 48 },
    { name: "Feature Steering Wheel", price: 96 },
    { name: "3 point seat belt per row", price: 60 },
    { name: "Running Boards", price: 108 },
    { name: "DOT Fold down Windshield & Lighted Tag Brkt", price: 108 },
    { name: "Subwoofer", price: 108 },
    { name: "Seats with folding armrest per row", price: 120 },
    { name: "Welcome Light and Stainless steel plate", price: 156 },
    { name: "Trifold Seat", price: 480 },
    { name: "Premium Wheels", price: 123.20 },
    { name: "Carbon Fibre I", price: 162 },
    { name: "Carbon Fibre II", price: 180 },
  ];

  useEffect(() => {
    let filteredAddOns = initialAddOns.filter(addOn => {
      if (formData.cartModel === "Fleet (2 Seater) Golf Cart") {
        return ["Cooler", "Sand and seed bottles", "Ball Washer"].includes(addOn.name);
      } else if (["Personal (2+2 Seater) Non Lifted Golf Cart", "Personal (2+2 Seater) Lifted Golf Cart"].includes(formData.cartModel)) {
        return addOn.name !== "Carbon Fibre II";
      } else if (["Personal (4+2 Seater) Non Lifted Golf Cart", "Personal (4+2 Seater) Lifted Golf Cart"].includes(formData.cartModel)) {
        return addOn.name !== "Carbon Fibre I";
      }
      return true;
    });

    setAvailableAddOns(filteredAddOns);

    // Check if Carbon Fibre add-ons need to be switched
    if (formData.addOns.some(addOn => addOn.name === "Carbon Fibre I") && ["Personal (4+2 Seater) Non Lifted Golf Cart", "Personal (4+2 Seater) Lifted Golf Cart"].includes(formData.cartModel)) {
      const newAddOns = formData.addOns.filter(addOn => addOn.name !== "Carbon Fibre I").concat({ name: "Carbon Fibre II", price: 180 });
      setFormData({
        ...formData,
        addOns: newAddOns,
        totalPrice: calculateTotalPrice(formData.basePrice, formData.battery_price, newAddOns, formData.paintPrice)
      });
    } else if (formData.addOns.some(addOn => addOn.name === "Carbon Fibre II") && ["Personal (2+2 Seater) Non Lifted Golf Cart", "Personal (2+2 Seater) Lifted Golf Cart"].includes(formData.cartModel)) {
      const newAddOns = formData.addOns.filter(addOn => addOn.name !== "Carbon Fibre II").concat({ name: "Carbon Fibre I", price: 162 });
      setFormData({
        ...formData,
        addOns: newAddOns,
        totalPrice: calculateTotalPrice(formData.basePrice, formData.battery_price, newAddOns, formData.paintPrice)
      });
    }

    // Update paint options based on the selected cart model
    if (formData.cartModel === "Fleet (2 Seater) Golf Cart") {
      setPaintOptions({
        "Metallic/Matte Paint": { price: 60, colors: ["Select Color", "Red", "Black", "White"] }
      });
      if (formData.paint === "Chameleon Paint") {
        setFormData({
          ...formData,
          paint: "Metallic/Matte Paint",
          paintColor: "Select Color",
          paintPrice: 60,
          totalPrice: calculateTotalPrice(formData.basePrice, formData.battery_price, formData.addOns, 60),
        });
      }
    } else {
      setPaintOptions({
        "Metallic/Matte Paint": { price: 60, colors: ["Select Color", "Red", "Black", "White"] },
        "Chameleon Paint": { price: 360, colors: ["Select Color", "Blue", "Green", "Purple"] }
      });
    }

  }, [formData.cartModel]);

  const calculateTotalPrice = (basePrice, batteryPrice, addOns, paintPrice) => {
    const subtotal = basePrice + batteryPrice + addOns.reduce((acc, addOn) => acc + addOn.price, 0) + paintPrice;
    const taxAmount = subtotal * TAX_RATE;
    return subtotal + taxAmount;
  };

  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    let basePrice;

    switch (selectedModel) {
      case "Fleet (2 Seater) Golf Cart":
        basePrice = 6875;
        break;
      case "Personal (2+2 Seater) Non Lifted Golf Cart":
        basePrice = 10867.80;
        break;
      case "Personal (2+2 Seater) Lifted Golf Cart":
        basePrice = 11347.80;
        break;
      case "Personal (4+2 Seater) Non Lifted Golf Cart":
        basePrice = 11317.80;
        break;
      case "Personal (4+2 Seater) Lifted Golf Cart":
        basePrice = 11947.80;
        break;
      default:
        basePrice = 6875;
    }

    const totalPrice = calculateTotalPrice(basePrice, formData.battery_price, [], formData.paintPrice);

    // Reset the formData's addOns array to an empty array (no add-ons selected)
    setFormData({
      ...formData,
      cartModel: selectedModel,
      basePrice: basePrice,
      addOns: [], // Reset addOns to empty array
      totalPrice: totalPrice, // Update totalPrice to include tax
      paint: selectedModel === "Fleet (2 Seater) Golf Cart" ? "Metallic/Matte Paint" : formData.paint,
      paintColor: "Select Color",
      paintPrice: selectedModel === "Fleet (2 Seater) Golf Cart" ? paintOptions["Metallic/Matte Paint"].price : formData.paintPrice,
    });

    // Update the availableAddOns state to reflect updated options
    setAvailableAddOns(initialAddOns);
  };

  const handleBatteryChange = (e) => {
    const selectedBattery = e.target.value;
    let batteryPrice = 0;

    if (selectedBattery === "Lithium 48V 5KW 105AH") {
      batteryPrice = 720;
    } else if (selectedBattery === "Lithium 72V 6.3 KW 105AH") {
      batteryPrice = 1320;
    }

    const totalPrice = calculateTotalPrice(formData.basePrice, batteryPrice, formData.addOns, formData.paintPrice);

    setFormData({
      ...formData,
      battery: selectedBattery,
      battery_price: batteryPrice,
      totalPrice: totalPrice,
    });
  };

  const handleAddOnChange = (e, addOnName, addOnPrice) => {
    const checked = e.target.checked;
    let newAddOns = formData.addOns;

    if (checked) {
      newAddOns.push({ name: addOnName, price: addOnPrice });
    } else {
      newAddOns = newAddOns.filter((addOn) => addOn.name !== addOnName);
    }

    const totalPrice = calculateTotalPrice(formData.basePrice, formData.battery_price, newAddOns, formData.paintPrice);

    setFormData({
      ...formData,
      addOns: newAddOns,
      totalPrice: totalPrice,
    });
  };

  const handlePaintChange = (e) => {
    const selectedPaint = e.target.value;
    const paintPrice = paintOptions[selectedPaint].price;

    const totalPrice = calculateTotalPrice(formData.basePrice, formData.battery_price, formData.addOns, paintPrice);

    setFormData({
      ...formData,
      paint: selectedPaint,
      paintPrice: paintPrice,
      paintColor: "Select Color",
      totalPrice: totalPrice,
    });
  };

  const handlePaintColorChange = (e) => {
    const selectedColor = e.target.value;
    const totalPrice = calculateTotalPrice(formData.basePrice, formData.battery_price, formData.addOns, formData.paintPrice);

    setFormData({
      ...formData,
      paintColor: selectedColor,
      totalPrice: totalPrice,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous message

    if (formData.paintColor === "Select Color") {
      setMessage("Please select a valid paint color before submitting.");
      return;
    }

    try {
      const formattedPaint = `${formData.paint.split(" ")[0]} - ${formData.paintColor}`;
      const response = await fetch("https://invoice-backend-wheat.vercel.app/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, paint: formattedPaint }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        window.open(url); // Open the PDF in a new tab
        window.location.reload();
      } else {
        setMessage("Failed to generate the invoice.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while generating the invoice.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Golf Cart Invoice Form</h1>
      <label>
        Customer Name:
        <input
          type="text"
          name="customerName"
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
        />
      </label>
      <label>
        Address 1:
        <input
          type="text"
          name="address1"
          onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
        />
      </label>
      <label>
        Unit:
        <input
          type="text"
          name="unit"
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        />
      </label>
      <label>
        City:
        <input
          type="text"
          name="city"
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
      </label>
      <label>
        State:
        <input
          type="text"
          name="state"
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
        />
      </label>
      <label>
        ZIP Code:
        <input
          type="text"
          name="zipCode"
          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
        />
      </label>
      <label>
        Cart Model:
        <select name="cartModel" onChange={handleModelChange} value={formData.cartModel}>
          <option value="Fleet (2 Seater) Golf Cart">Fleet (2 Seater) Golf Cart - $6,875.00</option>
          <option value="Personal (2+2 Seater) Non Lifted Golf Cart">Personal (2+2 Seater) Non Lifted Golf Cart - $10,867.80</option>
          <option value="Personal (2+2 Seater) Lifted Golf Cart">Personal (2+2 Seater) Lifted Golf Cart - $11,347.80</option>
          <option value="Personal (4+2 Seater) Non Lifted Golf Cart">Personal (4+2 Seater) Non Lifted Golf Cart - $11,317.80</option>
          <option value="Personal (4+2 Seater) Lifted Golf Cart">Personal (4+2 Seater) Lifted Golf Cart - $11,947.80</option>
        </select>
      </label>
      <label>
        Battery:
        <select name="battery" onChange={handleBatteryChange} value={formData.battery}>
          <option value="AMG batteries 150A-48 V (Standard)">AMG batteries 150A-48 V (Standard)</option>
          <option value="Lithium 48V 5KW 105AH">Lithium 48V 5KW 105AH - $720.00</option>
          <option value="Lithium 72V 6.3 KW 105AH">Lithium 72V 6.3 KW 105AH - $1,320.00</option>
        </select>
      </label>
      <label>
        Paint Type:
        <select name="paint" onChange={handlePaintChange} value={formData.paint}>
          {Object.keys(paintOptions).map((paintType) => (
            <option key={paintType} value={paintType}>
              {paintType} - ${paintOptions[paintType].price.toFixed(2)}
            </option>
          ))}
        </select>
      </label>
      {formData.paint && (
        <label>
          Paint Color:
          <select name="paintColor" onChange={handlePaintColorChange} value={formData.paintColor}>
            {paintOptions[formData.paint].colors.map((color, index) => (
              <option key={index} value={color}>{color}</option>
            ))}
          </select>
        </label>
      )}
      <div>
        <h3>Add-ons</h3>
        <div className="addons">
          {availableAddOns.map((addOn, index) => (
            <div key={index} className="addon-item">
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => handleAddOnChange(e, addOn.name, addOn.price)}
                />
                {addOn.name}
              </label>
              <span>${addOn.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="total-price">Total Price (incl. Tax): ${formData.totalPrice.toFixed(2)}</p>
      <img src={cartImage} alt="Golf Cart" className="cart-image" /> {/* Add the image here */}
      <button type="submit">Generate Invoice</button>
      {message && <p className={`message ${message.startsWith('Failed') ? 'error' : 'success'}`}>{message}</p>}
    </form>
  );
}

export default InvoiceForm;
