"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./HeroSection.css";

function HeroSection() {
  const images = [
    { src: "/image/hotel4.jpeg" },
    { src: "/image/room5.jpeg" },
    { src: "/image/hotel2.jpeg" },
    { src: "/image/room3.jpeg" },
    { src: "/image/temple1.webp" },
  ];

  const [itemActive, setItemActive] = useState(0);
  const itemsRef = useRef([]);
  const thumbnailsRef = useRef([]);
  const intervalRef = useRef(null);
  const contentRef = useRef(null);

  const countItem = images.length;

  // Show slider function
  const showSlider = () => {
    itemsRef.current.forEach((item, index) => {
      if (index === itemActive) {
        item.classList.add("active");
        thumbnailsRef.current[index].classList.add("active");
      } else {
        item.classList.remove("active");
        thumbnailsRef.current[index].classList.remove("active");
      }
    });
    setPositionThumbnail();
  };

  // Set position of the active thumbnail
  const setPositionThumbnail = () => {
    const thumbnailActive = thumbnailsRef.current[itemActive];
    const rect = thumbnailActive.getBoundingClientRect();
    if (rect.left < 0 || rect.right > window.innerWidth) {
      thumbnailActive.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    }
  };

  // Move to next slide
  const nextSlide = () => {
    setItemActive((prev) => (prev + 1) % countItem);
  };

  // Move to previous slide
  const prevSlide = () => {
    setItemActive((prev) => (prev - 1 + countItem) % countItem);
  };

  // Thumbnail click handler
  const handleThumbnailClick = (index) => {
    setItemActive(index);
  };

  // Auto run slider with interval
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  // Update slider and animate content when the active item changes
  useEffect(() => {
    showSlider();

    // Animate content with GSAP
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 200 }, // Start state
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" } // End state
      );
    }

    // Reset interval when itemActive changes
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextSlide, 5000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [itemActive]);

  return (
    <div className="slider " style={{ zIndex: 0 }}>
      {/* List Items */}
      <div className="list">
        {images.map((image, index) => (
          <div
            key={index}
            className={`item ${index === itemActive ? "active" : ""}`}
            ref={(el) => (itemsRef.current[index] = el)}
          >
            <img
              src={image.src}
              alt={`Slider ${index + 1}`}
              className="w-full h-screen object-cover"
            />
          </div>
        ))}
      </div>

      {/* Wrapper for the content, arrows, and thumbnails */}
      <div className="max-w-screen-xl mx-auto px-4 relative z-10">
        {/* Content */}
        <div className="content" >
          <p>जय श्री राम</p> {/* First */}
          <h2 className="font-serif font-bold bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-transparent bg-clip-text">
            Veer Raghav
          </h2> {/* Second */}
          <h3>Hotel</h3> {/* Third */}
          <p>
            Stay in comfort close to the Ram Mandir <br />
            Discover the essence of Ayodhya with us, where <br /> tradition
            meets luxury. {/* Last */}
          </p>
        </div>

        {/* Button Arrows */}
        <div className="arrows">
          <button id="prev" onClick={prevSlide}>
            &lt;
          </button>
          <button id="next" onClick={nextSlide}>
            &gt;
          </button>
        </div>

        {/* Thumbnail */}
        <div className="thumbnail">
          {images.map((image, index) => (
            <div
              key={index}
              className={`item ${index === itemActive ? "active" : ""}`}
              onClick={() => handleThumbnailClick(index)}
              ref={(el) => (thumbnailsRef.current[index] = el)}
            >
              <img src={image.src} alt={`Thumbnail ${index + 1}`} className="cursor-pointer"/>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Button
      <div className="fixed bottom-4 right-4 " style={{ zIndex: 9999 }}>
        <button>
          <img
            src="/image/whatsapp.png"
            alt="WhatsApp Icon"
            className="pulse-animation w-16 h-16"
          />
        </button>
      </div> */}
    </div>
  );
}

export default HeroSection;
