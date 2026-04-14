import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function ScrollRestoration() {
  const location = useLocation();
  const scrollPositions = useRef({}); // To store scroll positions for routes

  // Restore scroll position on route change
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Save scroll position before navigating away
  useEffect(() => {
    const handleSaveScrollPosition = () => {
      scrollPositions.current[location.key] = {
        x: window.scrollX,
        y: window.scrollY,
      };
    };

    // Save position on navigation or page unload
    window.addEventListener("beforeunload", handleSaveScrollPosition);
    return () => {
      window.removeEventListener("beforeunload", handleSaveScrollPosition);
      handleSaveScrollPosition(); // Save position on component unmount
    };
  }, [location]);

  return null;
}

export default ScrollRestoration;
