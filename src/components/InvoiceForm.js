import React, { useState, useEffect } from "react";
import '../App.css'; // Ensure you have the App.css imported for styling
import cartImage from '../photos/cart.jpg'; // Import the image

function InvoiceForm() {
  const TAX_RATE = 0.0;

  const [formData, setFormData] = useState({
    customerName: "",
    billingAddress1: "",
    billingAddress2: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    shippingAddressSame: "yes",
    shippingCustomerName: "",
    shippingAddress1: "",
    shippingAddress2: "",
    shippingCity: "",
    shippingState: "",
    shippingZipCode: "",
    cartModel: "Fleet (2 Seater) Golf Cart",
    basePrice: 9465.00,
    battery: "AMG batteries 150A-48 V (Standard)",
    battery_price: 0,
    paint: "Standard Paint", // Default paint type
    paintColor: "Select Color", // Default color
    paintPrice: 0, // Default price for Standard Paint
    addOns: [],
    totalPrice: 9465.00 * (1 + TAX_RATE),
  });

  const [message, setMessage] = useState(""); // State to hold the response message
  const [availableAddOns, setAvailableAddOns] = useState([]);
  const [paintOptions, setPaintOptions] = useState({
    "Standard Paint": { price: 0, colors: ["Select Color", "White", "Blue", "Green"] },
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
    { name: "Premium Wheels", price: 257.20 },
    { name: "Carbon Fibre I", price: 162 },
    { name: "Carbon Fibre II", price: 180 },
    {name: "Upgraded Seat with Headrest", price:72}
  ];

  useEffect(() => {
    let filteredAddOns = initialAddOns.filter(addOn => {
      if (formData.cartModel === "Fleet (2 Seater) Golf Cart") {
        return ["Cooler", "Sand and seed bottles", "Ball Washer", "Upgraded Seat with Headrest"].includes(addOn.name);
      } else if (["Personal (2+2 Seater) Non Lifted Golf Cart", "Personal (2+2 Seater) Lifted Golf Cart"].includes(formData.cartModel)) {
        return addOn.name !== "Carbon Fibre II" && addOn.name !==  "Upgraded Seat with Headrest";
      } else if (["Personal (4+2 Seater) Non Lifted Golf Cart", "Personal (4+2 Seater) Lifted Golf Cart"].includes(formData.cartModel)) {
        return addOn.name !== "Carbon Fibre I" && addOn.name !== "Upgraded Seat with Headrest";
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
        "Standard Paint": { price: 0, colors: ["Select Color", "White", "Blue", "Green"] },
        "Metallic/Matte Paint": { price: 60, colors: ["Select Color", "Red", "Black", "White"] }
      });
      if (formData.paint === "Chameleon Paint") {
        setFormData({
          ...formData,
          paint: "Standard Paint",
          paintColor: "Select Color",
          paintPrice: 0,
          totalPrice: calculateTotalPrice(formData.basePrice, formData.battery_price, formData.addOns, 0),
        });
      }
    } else {
      setPaintOptions({
        "Standard Paint": { price: 0, colors: ["Select Color", "White", "Blue", "Green"] },
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
        basePrice = 9398.15;
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
        basePrice = 9398.15;
    }

    // Reset the formData's addOns array to an empty array (no add-ons selected) and update the total price
    const totalPrice = calculateTotalPrice(basePrice, formData.battery_price, [], formData.paintPrice);

    setFormData({
      ...formData,
      cartModel: selectedModel,
      basePrice: basePrice,
      addOns: [], // Reset addOns to empty array
      totalPrice: totalPrice, // Update totalPrice to include tax
      paint: selectedModel === "Fleet (2 Seater) Golf Cart" ? "Standard Paint" : formData.paint,
      paintColor: "Select Color",
      paintPrice: selectedModel === "Fleet (2 Seater) Golf Cart" ? paintOptions["Standard Paint"].price : formData.paintPrice,
    });

    // Update the availableAddOns state to reflect updated options
    setAvailableAddOns(initialAddOns.map(addOn => ({ ...addOn, selected: false })));
  };

  const handleBatteryChange = (e) => {
    const selectedBattery = e.target.value;
    let batteryPrice = 0;

    if (selectedBattery === "Lithium 48V 5KW 105AH") {
      batteryPrice = 600;
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

  const handleShippingAddressSameChange = (e) => {
    setFormData({
      ...formData,
      shippingAddressSame: e.target.value
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
      console.log(JSON.stringify(formData));
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
      <h2>Billing Address</h2>
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
          name="billingAddress1"
          onChange={(e) => setFormData({ ...formData, billingAddress1: e.target.value })}
        />
      </label>
      <label>
        Address 2:
        <input
          type="text"
          name="billingAddress2"
          onChange={(e) => setFormData({ ...formData, billingAddress2: e.target.value })}
        />
      </label>
      <div className="address-line">
        <label>
          City:
          <input
            type="text"
            name="billingCity"
            onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
          />
        </label>
        <label>
          State:
          <input
            type="text"
            name="billingState"
            onChange={(e) => setFormData({ ...formData, billingState: e.target.value })}
          />
        </label>
        <label>
          ZIP Code:
          <input
            type="text"
            name="billingZipCode"
            onChange={(e) => setFormData({ ...formData, billingZipCode: e.target.value })}
          />
        </label>
      </div>

      <label className="shipping-question">
        Shipping Address Same as Billing Address?
        <select name="shippingAddressSame" onChange={handleShippingAddressSameChange} value={formData.shippingAddressSame}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </label>

      {formData.shippingAddressSame === "no" && (
        <>
          <h2>Shipping Address</h2>
          <label>
            Customer Name:
            <input
              type="text"
              name="shippingCustomerName"
              onChange={(e) => setFormData({ ...formData, shippingCustomerName: e.target.value })}
            />
          </label>
          <label>
            Address 1:
            <input
              type="text"
              name="shippingAddress1"
              onChange={(e) => setFormData({ ...formData, shippingAddress1: e.target.value })}
            />
          </label>
          <label>
            Address 2:
            <input
              type="text"
              name="shippingAddress2"
              onChange={(e) => setFormData({ ...formData, shippingAddress2: e.target.value })}
            />
          </label>
          <div className="address-line">
            <label>
              City:
              <input
                type="text"
                name="shippingCity"
                onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="shippingState"
                onChange={(e) => setFormData({ ...formData, shippingState: e.target.value })}
              />
            </label>
            <label>
              ZIP Code:
              <input
                type="text"
                name="shippingZipCode"
                onChange={(e) => setFormData({ ...formData, shippingZipCode: e.target.value })}
              />
            </label>
          </div>
        </>
      )}

      <label className="cart-model">
        Cart Model:
        <select name="cartModel" onChange={handleModelChange} value={formData.cartModel}>
          <option value="Fleet (2 Seater) Golf Cart">Fleet (2 Seater) Golf Cart - $9,465.00</option>
          <option value="Personal (2+2 Seater) Non Lifted Golf Cart">Personal (2+2 Seater) Non Lifted Golf Cart - $10,867.80</option>
          <option value="Personal (2+2 Seater) Lifted Golf Cart">Personal (2+2 Seater) Lifted Golf Cart - $11,347.80</option>
          <option value="Personal (4+2 Seater) Non Lifted Golf Cart">Personal (4+2 Seater) Non Lifted Golf Cart - $11,317.80</option>
          <option value="Personal (4+2 Seater) Lifted Golf Cart">Personal (4+2 Seater) Lifted Golf Cart - $11,947.80</option>
        </select>
      </label>
      <label className="battery-label">
        Battery:
        <select name="battery" onChange={handleBatteryChange} value={formData.battery}>
          <option value="AMG batteries 150A-48 V (Standard)">AMG batteries 150A-48 V (Standard)</option>
          <option value="Lithium 48V 5KW 105AH">Lithium 48V 5KW 105AH - $600.00</option>
          <option value="Lithium 72V 6.3 KW 105AH">Lithium 72V 6.3 KW 105AH - $1,320.00</option>
        </select>
      </label>
      <label className="paint-label">
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
        <label className="paint-color">
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
                  checked={formData.addOns.some((selectedAddOn) => selectedAddOn.name === addOn.name)} // Ensure the checkbox is in sync with formData
                />
                {addOn.name}
              </label>
              <span>${addOn.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="total-price">Total Price (excl. Tax): ${formData.totalPrice.toFixed(2)}</p>
      <img src={cartImage} alt="Golf Cart" className="cart-image" /> {/* Add the image here */}
      <button type="submit">Generate Invoice</button>
      {message && <p className={`message ${message.startsWith('Failed') ? 'error' : 'success'}`}>{message}</p>}
    </form>
  );
}

export default InvoiceForm;
