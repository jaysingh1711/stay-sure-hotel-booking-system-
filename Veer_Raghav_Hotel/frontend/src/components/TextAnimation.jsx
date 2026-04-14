import React from 'react'
import "./TextAnimation.css"

function TextAnimation( { hotelData } ) {
  return (
        <h1 className='name max-w-screen-lg mx-auto px-4 font-montserrat text-[75px] sm:text-[100px] md:text-[100px] font-extrabold text-center'>{hotelData ? hotelData?.name : 'Veer Raghav'}</h1>
  )
}

export default TextAnimation
