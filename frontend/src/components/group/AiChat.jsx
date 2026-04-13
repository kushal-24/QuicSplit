import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useGroupFileUpload } from '../../Hoooks/fileManager';
import someTestFile from "../../../public/bill.png"

export default function AiChat({groupId, onFetchGroupData}) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'split 800 for dinner between all 4', sender: 'user' },
    { id: 2, text: 'Done! ₹200 each. Expense added to the group.', sender: 'bot' },
    { id: 3, text: 'Raj paid Kushal 200 yesterday', sender: 'user' },
    { id: 4, text: "Recorded. Raj's debt reduced by ₹200. Balances updated.", sender: 'bot' },
  ]);

  const {upload, remove}= useGroupFileUpload()
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  //TESTING OF MY LLM//////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
  const testConnection = async () => {
    try {
      const formData = new FormData();
      // attach a test image
      formData.append("bill", someTestFile);

      const res = await api.post(`/group/${groupId}/uploadbill`, formData);
      console.log("🔥 TEST RESULT:", res.data);
    } catch (err) {
      console.log("❌ ERROR:", err.response?.data || err.message);
    }
  };

  testConnection();
}, []);
//TESTING OF MY LLM//////////////////////////////////////////////////////////////////////////////////////


  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
    // TODO: Send to LangGraph Endpoint
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    const tempMsgId = Date.now();
    setMessages(prev => [...prev, { id: tempMsgId, text: `Uploading file: ${file.name}...`, sender: 'user' }]);
    try {
      await upload(groupId, file);
      setMessages(prev => prev.map(msg => msg.id === tempMsgId ? { ...msg, text: `Uploaded file: ${file.name}` } : msg));

      const data = await res.json();
      if (data.success) {
        onFetchGroupData();  // refetch your expenses list
      }

    } catch (error) {
      console.error("File upload failed", error);
      setMessages(prev => prev.map(msg => 
        msg.id === tempMsgId ? { ...msg, text: `Failed to upload: ${file.name}` } : msg
      ));
    } finally {
      setSelectedFile(null);
      // Reset input value to allow selecting the same file again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[400px] border border-slate-800/80 bg-[#0A0D14]/50 rounded-2xl animate-in fade-in duration-300 relative overflow-hidden">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-5 z-10 flex flex-col">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-5 py-3 max-w-[85%] sm:max-w-[70%] font-medium text-[15px] ${
              msg.sender === 'user' 
                ? 'bg-[#2a4469] text-blue-50 rounded-2xl rounded-tr-sm shadow-sm' 
                : 'bg-[#1A1F2E] border border-slate-700/50 text-slate-200 rounded-2xl rounded-tl-sm shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#1A1F2E]/60 backdrop-blur-md border-t border-slate-800/80 z-10">
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ask anything or give a command..."
            className="flex-1 bg-[#0A0D14] border border-slate-700/50 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-[#6B5AED]/50 transition-colors shadow-inner"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="px-6 py-3.5 bg-[#1A1F2E] hover:bg-[#252b40] text-slate-300 border border-slate-700/50 rounded-xl font-medium text-sm transition-colors"
          >
            send
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3.5 bg-[#1A1F2E] hover:bg-[#252b40] text-slate-300 border border-slate-700/50 rounded-xl font-medium transition-colors flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
