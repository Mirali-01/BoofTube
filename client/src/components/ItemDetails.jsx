import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItem(id);
  }, [id]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItem = async (itemId) => {
    try {
      const response = await axios.get(`http://localhost:5000/items/${itemId}`);
      setItem(response.data);
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/items");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const getCurrentItemIndex = () => {
    return items.findIndex((item) => item._id === id);
  };

  if (!item) {
    return <p>Loading...</p>;
  }

  const currentIndex = getCurrentItemIndex();

  return (
    <div className="item-details">
      <Link to="/" className="go-home-button">
        Go Home
      </Link>
      <h2>{item.name}</h2>
      {item.videoUrl ? (
        <div className="video-container">
          <iframe
            src={item.videoUrl}
            title={item.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div className="video-container noVideo">No Video Available</div>
      )}
      <div className="navigation-buttons">
        {currentIndex > 0 && (
          <Link to={`/items/${items[currentIndex - 1]._id}`}>
            &#8592; Previous
          </Link>
        )}
        {currentIndex < items.length - 1 && (
          <Link to={`/items/${items[currentIndex + 1]._id}`}>Next &#8594;</Link>
        )}
      </div>
      <h2 style={{ textAlign: "center", textDecoration: "underline" }}>
        Lyrics
      </h2>
      <p>{item.description}</p>
    </div>
  );
}

export default ItemDetails;
