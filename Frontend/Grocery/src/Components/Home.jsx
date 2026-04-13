import React from 'react'
import GroceryHeroSwiper from './GroceryHeroSwiper'
import PersonalizedFeed from './PersonalizedFeed'
import CategoriesAndBestSellers from './CategoriesAndBestSellers'
import WhyWeAreBest from './WhyWeAreBest'
import Footer from './Footer'

function Home() {
  return (
    <>
      <GroceryHeroSwiper/>
      <PersonalizedFeed />
      <CategoriesAndBestSellers/>
      <WhyWeAreBest/>
      <Footer/>
    </>
  )
}

export default Home
