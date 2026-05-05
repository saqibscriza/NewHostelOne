import React from 'react';
import { Send, Paperclip } from 'lucide-react';

export default function TicketChat() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 flex flex-col h-[calc(100vh-120px)]">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">AC not working in Room No. 302</h1>
        <div className="flex gap-2">
          <span className="bg-red-50 text-red-600 border border-red-100 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> High Priority
          </span>
          <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> In Progress
          </span>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Conversation Details
          </div>
          <span className="text-sm font-medium text-gray-400">3 Messages</span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white/50">
          
          {/* User Message */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              {/* Dummy Avatar */}
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sandeep&backgroundColor=e2e8f0" alt="Sandeep" className="w-full h-full object-cover"/>
            </div>
            <div className="max-w-[80%]">
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="font-semibold text-gray-900">Sandeep Sharma</span>
                <span className="text-xs text-gray-400">(Student)</span>
                <span className="text-xs text-gray-400 ml-2">Oct 24, 09:15 AM</span>
              </div>
              <div className="bg-[#0f172a] text-white p-4 rounded-2xl rounded-tl-sm text-[15px] leading-relaxed shadow-sm">
                Hi, the AC in my room (402) has been making a grinding noise since last night and finally stopped blowing cold air this morning. It's quite hot here, could someone take a look?
              </div>
            </div>
          </div>

          {/* Admin Message */}
          <div className="flex gap-4 flex-row-reverse">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div className="max-w-[80%] flex flex-col items-end">
              <div className="flex items-baseline gap-2 mb-1.5 flex-row-reverse">
                <span className="font-semibold text-gray-900">Rajesh Kumar</span>
                <span className="text-xs text-gray-400">(Support Staff)</span>
                <span className="text-xs text-gray-400 mr-2">Oct 24, 10:30 AM</span>
              </div>
              <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed">
                Hello Sandeep, thanks for reporting this. I've assigned this to our maintenance team. They should be at your room within the next 2 hours to inspect the unit.
              </div>
            </div>
          </div>

        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
           <div className="flex items-end gap-3 bg-gray-50 rounded-2xl p-2 border border-gray-100 focus-within:border-slate-300 focus-within:bg-white transition-colors">
              <textarea 
                rows={1}
                placeholder="Type your response to Rajesh..."
                className="flex-1 bg-transparent border-none focus:outline-none resize-none px-3 py-2 text-[15px] text-gray-700 min-h-[44px] max-h-[120px]"
              ></textarea>
              <div className="flex items-center gap-1 pb-1 pr-1 shrink-0">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl transition-colors shadow-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
