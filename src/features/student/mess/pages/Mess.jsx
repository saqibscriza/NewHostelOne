import React from 'react';
import { Star, ShieldCheck, Truck, Headphones } from 'lucide-react';

export default function Mess() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mess Details</h1>
        <p className="text-gray-500 mt-1">View today's menu, upcoming meals, and mess schedule quickly</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Today's Menu</h2>
            <p className="text-gray-500 text-sm mt-1">Wednesday, Oct 25th</p>
          </div>
          <div className="flex bg-gray-50 p-1 rounded-lg">
            <button className="px-4 py-2 text-sm font-semibold rounded-md bg-white shadow-sm text-green-600">TODAY</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">TOMORROW</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">FULL WEEK</button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Breakfast */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
            <div className="w-24 shrink-0">
              <h3 className="font-bold text-gray-900 text-sm tracking-wider">BREAKFAST</h3>
              <p className="text-gray-400 text-xs mt-1">8:00 - 10:00</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl flex-1 text-gray-800 text-[15px]">
              Scrambled Eggs, Whole Wheat Toast, Coffee
            </div>
          </div>
          
          {/* Lunch */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
            <div className="w-24 shrink-0">
              <h3 className="font-bold text-gray-900 text-sm tracking-wider">LUNCH</h3>
              <p className="text-gray-400 text-xs mt-1">13:00 - 15:00</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl flex-1 text-gray-800 text-[15px]">
              Grilled Lemon Chicken, Organic Quinoa, Seasonal Salad
            </div>
          </div>

          {/* Dinner */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
            <div className="w-24 shrink-0">
              <h3 className="font-bold text-gray-900 text-sm tracking-wider">DINNER</h3>
              <p className="text-gray-400 text-xs mt-1">20:00 - 22:00</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl flex-1 text-gray-800 text-[15px]">
              Vegetable Lasagna, Roasted Garlic Bread
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-400 text-xs tracking-widest uppercase">Recent Meal Feedback</h3>
          <button className="text-sm font-semibold text-green-600 hover:text-green-700">View All</button>
        </div>

        <div className="space-y-4">
          {/* Feedback 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 bg-gray-50/50 rounded-xl p-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-400 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Sunday Dinner: Roasted Chicken</h4>
                <p className="text-gray-500 text-xs mt-0.5">Yesterday • 20:15</p>
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => <Star key={i} className="w-5 h-5 fill-green-500 text-green-500" />)}
              <Star className="w-5 h-5 text-gray-300" />
            </div>
          </div>

          {/* Feedback 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 bg-gray-50/50 rounded-xl p-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-400 shrink-0">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Sunday Lunch: Thai Red Curry</h4>
                <p className="text-gray-500 text-xs mt-0.5">Yesterday • 13:30</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm shrink-0 uppercase tracking-wide">
              Rate Meal
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="bg-gray-50 p-2.5 rounded-lg text-gray-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-[13px]">Quality Certified</h4>
            <p className="text-gray-500 text-xs mt-0.5">ISO 22000 Food Safety Standards</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="bg-gray-50 p-2.5 rounded-lg text-gray-700">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-[13px]">Supply Update</h4>
            <p className="text-gray-500 text-xs mt-0.5">Fresh organic produce arriving daily at 05:00</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="bg-gray-50 p-2.5 rounded-lg text-gray-700">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-[13px]">Support Desk</h4>
            <p className="text-gray-500 text-xs mt-0.5">Immediate assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
