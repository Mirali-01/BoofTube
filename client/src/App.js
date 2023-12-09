import { Routes, Route } from "react-router-dom";
import ItemList from "./components/ItemList";
import ItemDetails from "./components/ItemDetails";
import ScrollToTopButton from "./components/ScrollToTopButton";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ItemList />} />
        <Route path="/items/:id" element={<ItemDetails />} />
      </Routes>
      <ScrollToTopButton />
    </>
  );
}

export default App;
