import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Rajesh Yadav",
    location: "Kanpur, UP",
    quote: "GrocoMart helped me reach new customers without leaving my store. I now get regular orders every day!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfq9__J9SxWTKGv0TzwO9Op11XeirTi5w0Eg&s",
  },
  {
    name: "Suman Verma",
    location: "Bhopal, MP",
    quote: "The onboarding was super easy. Payments are fast, and I don’t have to worry about deliveries.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1RzQ-qCK2JBM_Vz6I9Ijt4nOU8lWx_AXczQ&s",
  },
  {
    name: "Imran Sheikh",
    location: "Lucknow, UP",
    quote: "I joined GrocoMart 2 months ago, and my earnings have doubled. Highly recommend to other vendors!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRznAIloVWnLIDHsKZit8uPi5w7Cy8_Q3JlGA&s",
  },
];

export default function SellerTestimonials() {
  return (
    <section className="bg-green-50 py-16 px-4 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          What Our Sellers Say
        </h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((seller, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white rounded-xl shadow p-6 text-left h-full flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={seller.image}
                    alt={seller.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{seller.name}</h4>
                    <p className="text-sm text-gray-500">{seller.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic">“{seller.quote}”</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
