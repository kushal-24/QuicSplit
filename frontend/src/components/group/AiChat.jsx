import React, { useState, useRef } from 'react';
import { Plus, X, FileText } from 'lucide-react';
import { useGroupFileUpload } from '../../Hoooks/fileManager';
import { chatWithAi } from '../../Api/group.api';
import ReactMarkdown from "react-markdown"

export default function AiChat({ groupId, onFetchGroupData }) {
  const [messages, setMessages] = useState([
    // { id: 1, text: 'split 800 for dinner between all 4', sender: 'user' },
    // { id: 2, text: 'Done! ₹200 each. Expense added to the group.', sender: 'bot' },
    // { id: 3, text: 'Raj paid Kushal 200 yesterday', sender: 'user' },
    // { id: 4, text: "Recorded. Raj's debt reduced by ₹200. Balances updated.", sender: 'bot' },
]);

  const { upload, remove } = useGroupFileUpload()
  const fileInputRef = useRef(null);
  

  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    const currentInput = input;
    const currentFile = selectedFile;
    const tempMsgId = Date.now();

    // Optimistic UI Update
    setMessages(prev => [...prev, {
      id: tempMsgId,
      text: currentInput || (currentFile ? `Uploading file: ${currentFile.name}...` : ''),
      sender: 'user',
      file: currentFile ? (previewUrl || true) : null
    }]);

    setInput('');
    removeSelectedFile();

    if (currentFile) {
      setIsProcessing(true);
      try {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: `Analyzing receipt/document...`, sender: 'bot' }]);
        const res = await upload(groupId, currentFile);

        console.log("🔥 AI RESULT:", res);

        // Update user message to reflect it was completed
        setMessages(prev => prev.map(msg => msg.id === tempMsgId ? { ...msg, text: currentInput || `Uploaded file: ${currentFile.name}` } : msg));

        // Note: adjust `res.message` depending on your actual API response structure
        const botText = res.message || res.data || "File processed successfully and expenses added.";
        setMessages(prev => [...prev, { id: Date.now() + 2, text: botText, sender: 'bot' }]);

        if (onFetchGroupData) onFetchGroupData();
      } catch (error) {
        console.error("File processing failed", error);
        setMessages(prev => [...prev, { id: Date.now() + 2, text: `Failed to process file. ${error.response?.data?.message || 'Please try again.'}`, sender: 'bot' }]);
      } finally {
        setIsProcessing(false);
      }
    }
     else {
      setIsProcessing(true);
      try {
        // Map UI messages into role/content schema expected by backend
        const historyForApi = messages.map(m => ({ 
          role: m.sender === 'user' ? 'user' : 'assistant', 
          content: m.text
        }));
        
        // Append the new message that we just sent above
        historyForApi.push(
          { 
            role: 'user', 
            content: currentInput 
          });

        const res = await chatWithAi(groupId, historyForApi);
        console.log("🔥 AI CHAT RESULT:", res.data);

        const assistantText = res.data?.data?.reply || res.data?.reply || res.data?.message || "Processed.";
        
        setMessages(prev => [...prev, { id: Date.now() + 1, text: assistantText, sender: 'assistant' }]);

        if (onFetchGroupData) onFetchGroupData();
      } catch (error) {
        console.error("Text chat failed", error);
        setMessages(prev => [...prev, { id: Date.now() + 1, text: `Failed to send message. ${error.response?.data?.message || 'Please try again.'}`, sender: 'assistant' }]);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[400px] max-h-[600px] border border-slate-800/80 bg-[#0A0D14]/50 rounded-2xl animate-in fade-in duration-300 relative overflow-hidden">

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-5 z-10 flex flex-col">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-5 py-3 max-w-[85%] sm:max-w-[70%] font-medium text-[15px] flex flex-col gap-2 ${msg.sender === 'user'
              ? 'bg-[#2a4469] text-blue-50 rounded-2xl rounded-tr-sm shadow-sm'
              : 'bg-[#1A1F2E] border border-slate-700/50 text-slate-200 rounded-2xl rounded-tl-sm shadow-sm'
              }`}>
              {msg.file && typeof msg.file === 'string' && ( //checking if file is a picture
                <img src={msg.file} alt="attached" className="max-w-[150px] sm:max-w-[200px] rounded-lg mb-2 opacity-90" />
              )}
              {msg.file && typeof msg.file !== 'string' && ( //display props change if file type is not a photo...some pdf or smth
                <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg mb-2">
                  <FileText size={16} className="text-blue-300" />
                  <span className="text-xs opacity-80">Document attached</span>
                </div>
              )}
              <span><ReactMarkdown>{msg.text}</ReactMarkdown></span>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="px-5 py-3 bg-[#1A1F2E] border border-slate-700/50 text-slate-400 rounded-2xl rounded-tl-sm shadow-sm animate-pulse flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#1A1F2E]/60 backdrop-blur-md border-t border-slate-800/80 z-10 flex flex-col gap-3">
        {/* Thumbnail Preview Area */}
        {selectedFile && (
          <div className="relative flex items-center gap-3 p-2 bg-[#0A0D14]/80 rounded-xl border border-slate-700/50 w-max shadow-sm group animate-in slide-in-from-bottom-2 duration-200">
            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="w-12 h-12 object-cover rounded-md border border-slate-700" />
            ) : (
              <div className="w-12 h-12 bg-slate-800 rounded-md flex items-center justify-center border border-slate-700">
                <FileText size={20} className="text-slate-400" />
              </div>
            )}
            <div className="flex flex-col max-w-[150px] pr-4">
              <span className="text-sm font-medium text-slate-200 truncate">{selectedFile.name}</span>
              <span className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <button
              onClick={removeSelectedFile}
              className="absolute -top-2 -right-2 bg-slate-700 hover:bg-red-500/90 rounded-full p-1 text-white shadow-md transition-colors">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ask anything or upload a bill..."
            className="flex-1 bg-[#0A0D14] border border-slate-700/50 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-[#6B5AED]/50 transition-colors shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
            onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleSend()}
            disabled={isProcessing}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing && !groupId}
            title="Upload Bill"
            className="p-3.5 bg-[#1A1F2E] hover:bg-[#252b40] text-slate-300 border border-slate-700/50 rounded-xl font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:hover:bg-[#1A1F2E]"
          >
            <Plus size={20} />
          </button>

          <button
            onClick={handleSend}
            disabled={(!input.trim() && !selectedFile) || isProcessing}
            className="px-6 py-3.5 bg-[#6B5AED]/10 hover:bg-[#6B5AED]/20 text-[#6B5AED] font-semibold border border-[#6B5AED]/30 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#6B5AED]/10 flex items-center gap-2">
            {isProcessing ? 'sending...' : 'send'}
          </button>
        </div>
      </div>
    </div>
  );
}
