import React from 'react'
import HeroSection from '../components/Hero'
import WhatWeDo from '../components/WhatWeDo'
import TestimonialCarousel from '../components/Testimonials'

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