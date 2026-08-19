import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    notes: "",
    expiryDate: "",
    quantity: "",
    price: "",
    brand: ""
  });

  const loadMedicines = () => {
    fetch("/api/medicine")
      .then((response) => response.json())
      .then((data) => setMedicines(data))
      .catch((error) => console.error("Error loading medicines:", error));
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const medicine = {
      fullName: form.fullName,
      notes: form.notes,
      expiryDate: form.expiryDate,
      quantity: Number(form.quantity),
      price: Number(form.price),
      brand: form.brand
    };

    const response = await fetch("/api/medicine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(medicine)
    });

    if (response.ok) {
      setForm({
        fullName: "",
        notes: "",
        expiryDate: "",
        quantity: "",
        price: "",
        brand: ""
      });

      loadMedicines();
    } else {
      alert("Failed to add medicine");
    }
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    const difference =
      (expiry - today) / (1000 * 60 * 60 * 24);

    return difference >= 0 && difference < 30;
  };

  return (
    <div className="container">
      <h1>ABC Pharmacy</h1>

      <h2>Add Medicine</h2>

      <form className="medicine-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Medicine Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />

        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          min="0"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Medicine</button>
      </form>

      <h2>Medicine List</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search medicine by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Expiry Date</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Brand</th>
          </tr>
        </thead>

        <tbody>
          {filteredMedicines.map((medicine) => {
            const expiringSoon = isExpiringSoon(medicine.expiryDate);
            const lowStock = medicine.quantity < 10;

            let rowClass = "";

            if (expiringSoon) {
              rowClass = "expiry-warning";
            } else if (lowStock) {
              rowClass = "quantity-warning";
            }

            return (
              <tr key={medicine.id} className={rowClass}>
                <td>{medicine.fullName}</td>
                <td>{medicine.expiryDate}</td>
                <td>{medicine.quantity}</td>
                <td>{Number(medicine.price).toFixed(2)}</td>
                <td>{medicine.brand}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;