import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button className="scroll-to-top" onClick={scrollToTop}>
      <FaArrowUp />
    </button>
  );
};

export default ScrollToTopButton;
