import React, { useState } from 'react';
import { Upload, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Support() {
  const navigate = useNavigate();
  const [priority, setPriority] = useState('Medium');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Request Maintenance</h1>
        <p className="text-gray-500 mt-1">Report issues in your room or common areas. Our technical team usually responds within 24 hours.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Form Area */}
        <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">Issue Category</label>
                <div className="relative">
                  <select className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none">
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Carpentry</option>
                    <option>Cleaning</option>
                    <option>Other</option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">Priority Level</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriority(level)}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors ${
                        priority === level 
                          ? 'border-slate-900 bg-slate-50 text-slate-900 border-2' 
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">Room/Location</label>
              <input 
                type="text" 
                defaultValue="Room 302-B"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">Subject</label>
              <input 
                type="text" 
                placeholder="Enter Subject Details"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">Description</label>
              <textarea 
                rows={4}
                placeholder="Describe the issue in detail..."
                className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 tracking-widest uppercase">Attachment</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mb-3" />
                <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
              Submit Maintenance Request <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Sidebar - Recent Requests */}
        <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase">Recent Requests</h3>
          </div>
          
          <div className="divide-y divide-gray-50">
            {/* Request 1 */}
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Resolved</span>
                <span className="text-xs text-gray-400">Oct 24, 2023</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Clogged Sink</h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">The bathroom sink is draining very slowly and making a gurgling sound.</p>
              </div>
              <button onClick={() => navigate('/student/support/1')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Chat Details</button>
            </div>

            {/* Request 2 */}
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">In Progress</span>
                <span className="text-xs text-gray-400">Oct 26, 2023</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">AC Not Cooling</h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">Unit powers on but only blows ambient temperature air.</p>
              </div>
              <button onClick={() => navigate('/student/support/2')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Chat Details</button>
            </div>

            {/* Request 3 */}
            <div className="p-6 space-y-3 bg-[#fffbf0]">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                   <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Open</span>
                   <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-full">2 message unread</span>
                </div>
                <span className="text-xs text-amber-600/70">Oct 28, 2023</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Flickering Light</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">Main tube light in room 302-B starts flickering after 10 mins.</p>
              </div>
              <button onClick={() => navigate('/student/support/3')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">Chat Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
