import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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
      <h2>{item.name}</h2>
      <p style={{ "white-space": "pre-wrap" }}>{item.description}</p>
    </div>
  );
}

export default ItemDetails;
