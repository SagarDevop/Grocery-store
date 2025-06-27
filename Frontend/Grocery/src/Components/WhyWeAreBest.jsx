import React from "react";
import { Truck, Leaf, Tag, Heart } from "lucide-react";

export default function WhyWeAreBest() {
  return (
    <div className="bg-green-50 py-12 mx-[6vw] md:px-20 flex flex-col md:flex-row items-center justify-center gap-10 border-rounded-lg shadow-lg">
      {/* Left Image Section */}
      <div className="relative w-full md:w-1/2 flex justify-center">
        <div className="bg-green-200 p-8 rounded-full w-[33vw] h-[49vh] relative">
          <img
            src="/women.png"
            alt="Delivery Woman"
            className="w-[33vw] h-auto object-cover rounded-xl absolute bottom-[0.4vh] left-8"
            style={{
              filter: "drop-shadow(0 9px 0 rgb(255, 255, 255))",
            }}
          />
        </div>
        <div className="absolute bottom-4 right-6  px-4 py-2 text-white rounded-full shadow-lg flex items-center gap-2 text-sm font-medium bg-green-900">
          <Truck className="w-4 h-4 text-white" />
          Fast Delivery in 30 Min
        </div>
      </div>

      {/* Right Text Section */}
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">
          Why We Are the Best?
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-4 ">
            <Truck className="text-green-600 w-6 h-6 mt-1" />
            <div>
              <p className="font-semibold ">Fastest Delivery</p>
              <p className="text-sm text-gray-600">
                Groceries delivered in under 30 minutes.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <Leaf className="text-green-600 w-6 h-6 mt-1" />
            <div>
              <p className="font-semibold">Freshness Guaranteed</p>
              <p className="text-sm text-gray-600">
                Fresh produce straight from the source.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <Tag className="text-green-600 w-6 h-6 mt-1" />
            <div>
              <p className="font-semibold">Affordable Prices</p>
              <p className="text-sm text-gray-600">
                Quality groceries at unbeatable prices.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <Heart className="text-green-600 w-6 h-6 mt-1" />
            <div>
              <p className="font-semibold">Trusted by Thousands</p>
              <p className="text-sm text-gray-600">
                Loved by 10,000+ happy customers.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
