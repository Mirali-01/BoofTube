import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    toggleVisibility();

    const handleScroll = () => {
      toggleVisibility();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`scroll-to-top ${isVisible ? "show" : ""}`}
    >
      <FaArrowUp />
    </div>
  );
};

export default ScrollToTopButton;
