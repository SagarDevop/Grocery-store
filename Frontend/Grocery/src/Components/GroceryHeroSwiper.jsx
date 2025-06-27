import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import { motion } from 'framer-motion';

const heroSlides = [
  {
    title: 'Fresh Fruits',
    description: 'Handpicked seasonal fruits delivered to your door.',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Organic Vegetables',
    description: 'Clean, green, and pesticide-free vegetables.',
    image: 'https://media.istockphoto.com/id/1091697242/photo/bio-food-garden-produce-and-harvested-vegetable-fresh-farm-vegetables-in-wooden-box.webp?s=1024x1024&w=is&k=20&c=X0bDypcai7aWVVG6ncRcRe1fj78b-y0X7oWIZ1KeTEo=',
  },
  {
    title: 'Daily Essentials',
    description: 'Groceries, grains, and household supplies in one place.',
    image: 'https://plus.unsplash.com/premium_photo-1683598533816-fb5ad0b6e5a3?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export default function GroceryHeroSwiper() {
  return (
    <section className="w-full h-[90vh] overflow-hidden relative px-[6vw] pt-10">
      <Swiper
        modules={[Autoplay, EffectCoverflow]}
        effect="coverflow"
        loop
        centeredSlides
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 5000 }}
        className="h-full"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full h-[90vh]"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover "
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-10 md:p-20">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl text-white/90 max-w-xl drop-shadow-md">
                  {slide.description}
                </p>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
