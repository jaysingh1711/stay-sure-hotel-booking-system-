"use client"
import { useEffect, useRef, useState } from 'react';

const SparkleEffect = () => {
  const [sparkles, setSparkles] = useState(100);
  const [colour, setColour] = useState('random');
  const dotsRef = useRef([]);
  const starRef = useRef([]);
  const tinyRef = useRef([]);

  const colours = [
    '#ff0000', '#00ff00', '#ffffff', '#ff00ff',
    '#ffa500', '#ffff00', '#00ff00', '#ffffff', '#ff00ff'
  ];

  let x = 400, y = 300;
  let ox = x, oy = y;
  let swide = 800, shigh = 600;
  let tinyv = Array(sparkles).fill(0);
  let starv = Array(sparkles).fill(0);
  let starx = Array(sparkles).fill(0);
  let stary = Array(sparkles).fill(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      y = e.pageY;
      x = e.pageX;
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', setScroll);
    window.addEventListener('resize', setWidth);

    for (let i = 0; i < sparkles; i++) {
      createSparkle(i);
    }

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', setScroll);
      window.removeEventListener('resize', setWidth);
    };
  }, []);

  const createSparkle = (i) => {
    const starDiv = document.createElement('div');
    starDiv.style.position = 'absolute';
    starDiv.style.width = '5px';
    starDiv.style.height = '5px';
    starDiv.style.backgroundColor = 'transparent';
    starDiv.style.visibility = 'hidden';
    document.body.appendChild(starDiv);
    starRef.current[i] = starDiv;

    const tinyDiv = document.createElement('div');
    tinyDiv.style.position = 'absolute';
    tinyDiv.style.width = '2px';
    tinyDiv.style.height = '2px';
    tinyDiv.style.backgroundColor = starDiv.style.backgroundColor;
    tinyDiv.style.visibility = 'hidden';
    document.body.appendChild(tinyDiv);
    tinyRef.current[i] = tinyDiv;
  };

  const animate = () => {
    for (let i = 0; i < sparkles; i++) {
      if (starv[i]) updateStar(i);
      if (tinyv[i]) updateTiny(i);
    }
    requestAnimationFrame(animate);
  };

  const updateStar = (i) => {
    if (--starv[i] === 25) {
      starRef.current[i].style.clip = "rect(1px, 4px, 4px, 1px)";
    }
    if (starv[i]) {
      stary[i] += 1 + Math.random() * 3;
      starx[i] += (i % 5 - 2) / 5;
      if (stary[i] < shigh) {
        starRef.current[i].style.top = `${stary[i]}px`;
        starRef.current[i].style.left = `${starx[i]}px`;
      } else {
        starRef.current[i].style.visibility = "hidden";
        starv[i] = 0;
      }
    }
  };

  const updateTiny = (i) => {
    if (--tinyv[i] === 25) {
      tinyRef.current[i].style.width = "1px";
      tinyRef.current[i].style.height = "1px";
    }
    if (tinyv[i]) {
      tinyRef.current[i].style.top = `${stary[i]}px`;
      tinyRef.current[i].style.left = `${starx[i]}px`;
    } else {
      tinyRef.current[i].style.visibility = "hidden";
    }
  };

  const setScroll = () => {
    // Handle scrolling if needed
  };

  const setWidth = () => {
    // Handle resizing if needed
  };

  return null; // This component does not render anything
};

export default SparkleEffect;
