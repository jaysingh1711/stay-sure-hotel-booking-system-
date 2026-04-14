import React, { useEffect } from 'react'
import HeroSection from '@/components/HeroSection'
import Hmap from '@/components/Hmap'
// import { LayoutGrid } from '@/components/LayoutGrid'
import Rooms from '@/components/Rooms'
import TextAnimation from '@/components/TextAnimation'
import HotelBookingForm from '@/components/SearchBar'
import ReviewSlider from '@/components/Review'
import ImageSliderCards from '@/components/Imageslider'
import { useSettings } from '@/context/SettingsContext'

const Home = () => {
    const { gethotel, hotelData } = useSettings();


    useEffect(() => {
        const fetchHotelInfo = async () => {
            await gethotel();
        };

        fetchHotelInfo();
    }, []);
    return (
        <div>
            <HeroSection />
            <HotelBookingForm />
            <ImageSliderCards />
            {/* <LayoutGrid /> */}
            <TextAnimation text={hotelData}/>
            <ReviewSlider />
            {/* <Rooms /> */}
            <Hmap />
        </div>
    )
}

export default Home