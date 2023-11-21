import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/items");
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();

    if (!itemName.trim()) {
      setError("Item Name is required!");
      return;
    }

    try {
      if (editingItem) {
        const updatedItem = {
          _id: editingItem._id,
          name: itemName,
          description: itemDescription,
        };
        await axios.put(
          `http://localhost:5000/items/${editingItem._id}`,
          updatedItem
        );
        const updatedItems = items.map((item) =>
          item._id === editingItem._id ? updatedItem : item
        );
        setItems(updatedItems);
        setEditingItem(null);
      } else {
        const response = await axios.post("http://localhost:5000/items", {
          name: itemName,
          description: itemDescription,
        });
        setItems([...items, response.data]);
        setTimeout(() => scrollToNewlyAddedItem(response.data._id), 100);
      }
      setItemName("");
      setItemDescription("");
      setError("");
    } catch (error) {
      console.error("Error adding/editing item:", error);
      setError("Error adding item. Please try again.");
    }
  };

  const scrollToNewlyAddedItem = (itemId) => {
    const newItemCard = document.getElementById(`item-${itemId}`);
    if (newItemCard) {
      newItemCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      const updatedItems = items.filter((item) => item._id !== id);
      setItems(updatedItems);

      if (editingItem && editingItem._id === id) {
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const editItem = (item) => {
    setItemName(item.name.trim());
    setItemDescription(item.description);
    setEditingItem(item);
  };

  const cancelEdit = () => {
    setItemName("");
    setItemDescription("");
    setEditingItem(null);
  };

  const handleItemNameChange = (e) => {
    setItemName(e.target.value);
    setError("");
  };

  const handleDescriptionChange = (e) => {
    setItemDescription(e.target.value);
    setError("");
  };

  const scrollFormIntoView = () => {
    const formContainer = document.querySelector(".form-container");
    if (formContainer) {
      formContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="container">
      <h1 className="title">Full CRUD App</h1>
      <form onSubmit={addItem}>
        <div className="form-container">
          <input
            type="text"
            className="input-field"
            placeholder="Item Name"
            value={itemName}
            onChange={handleItemNameChange}
          />
          <textarea
            className="input-field"
            placeholder="Item Description (Optional)"
            value={itemDescription}
            onChange={handleDescriptionChange}
          ></textarea>
          {error && <p className="error">{error}</p>}
          <button
            type="submit"
            className="add-button"
            disabled={!itemName.trim()}
          >
            {editingItem ? "Edit Item" : "Add Item"}
          </button>
          {editingItem && (
            <button
              type="button"
              className="cancel-button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : items.length ? (
        <div className="cards-container">
          {items.map((item) => (
            <div key={item._id} id={`item-${item._id}`} className="card">
              <h3 className="card-title">{item.name}</h3>
              <Link to={`/items/${item._id}`}>View Details</Link>
              <p className="card-description">{item.description}</p>
              <div className="card-actions">
                <button
                  className="edit-button"
                  onClick={() => {
                    editItem(item);
                    scrollFormIntoView();
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteItem(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
};

export default ItemList;
