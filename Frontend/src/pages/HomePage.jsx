import React from 'react'
import HeroSection from '../components/Hero'
import WhatWeDo from '../components/WhatWeDo'
import TestimonialCarousel from '../components/Testimonials'
import DemoCarousel from '../components/Carousel'
const Home = () => {
  return (
    <>
      <HeroSection />
      <WhatWeDo/>
      <TestimonialCarousel/>
    </>
  )
}

export default Home