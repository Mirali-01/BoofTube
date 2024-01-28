import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const isValidYouTubeUrl = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return youtubeRegex.test(url);
};

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

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
          videoUrl: videoUrl,
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
        const embeddedUrl = getYouTubeEmbedUrl(videoUrl);
        if (!isValidYouTubeUrl(videoUrl)) {
          setError(
            "Invalid YouTube URL! Ex: https://www.youtube.com/watch?v={videoID} OR https://youtu.be/{videoID}"
          );
          return;
        }
        const response = await axios.post("http://localhost:5000/items", {
          name: itemName,
          description: itemDescription,
          videoUrl: embeddedUrl,
        });
        setItems([...items, response.data]);
        setTimeout(() => scrollToNewlyAddedItem(response.data._id), 100);
      }
      clearItem();
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

  const clearItem = () => {
    setItemName("");
    setItemDescription("");
    setVideoUrl("");
    setError("");
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
    setVideoUrl(item.videoUrl);
    setEditingItem(item);
    setError("");
  };

  const cancelEdit = () => {
    setItemName("");
    setItemDescription("");
    setVideoUrl("");
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

  const handleMediaChange = (e) => {
    setVideoUrl(e.target.value);
    setError("");
  };

  const getYouTubeEmbedUrl = (url) => {
    let embeddedUrl = "";
    if (url.includes("watch?v=")) {
      embeddedUrl = url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be")) {
      embeddedUrl = url.replace("youtu.be", "www.youtube.com/embed");
    } else {
      return (embeddedUrl = url);
    }
    return embeddedUrl;
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
          <input
            type="text"
            className="input-field"
            placeholder="Video URL (YouTube, etc.)"
            value={videoUrl}
            onChange={handleMediaChange}
          />
          {error && <p className="error">{error}</p>}
          <div className="button-container">
            <button
              type="submit"
              className="add-button"
              disabled={!itemName.trim()}
            >
              {editingItem ? "Edit" : "Add"}
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
            <button type="button" className="clear-button" onClick={clearItem}>
              Clear
            </button>
          </div>
        </div>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : items.length ? (
        <div className="cards-container">
          {items.map((item) => (
            <div key={item._id} id={`item-${item._id}`} className="card">
              <h3 className="card-title">{item.name}</h3>
              <Link to={`/items/${item._id}`}>View</Link>
              <p className="card-description">{item.description}</p>
              {item.videoUrl && (
                <div className="video-container">
                  <iframe
                    width="100%"
                    height="315"
                    src={getYouTubeEmbedUrl(item.videoUrl)}
                    title={item.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
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
