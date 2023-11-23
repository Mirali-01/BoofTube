import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ScrollToTopButton from "./ScrollToTopButton";

function ItemDetails() {
  const [item, setItem] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/items/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, [id]);

  if (!item) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Link to="/" className="go-home-button">
        Go Home
      </Link>
      <h2>{item.name}</h2>
      <p style={{ whiteSpace: "pre-wrap" }}>{item.description}</p>
      {item.videoUrl && (
        <div className="video-container">
          <iframe
            width="80%"
            height="500"
            src={item.videoUrl}
            title={item.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      <ScrollToTopButton />
    </div>
  );
}

export default ItemDetails;
