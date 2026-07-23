import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Conversation, Message } from '../types';
import { Send, ArrowLeft, Store, User as UserIcon, MessageSquare, MoreHorizontal } from 'lucide-react';

function Chat() {
    const navigate = useNavigate();
    const location = useLocation();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConv, setActiveConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [userUid, setUserUid] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/user');
                setUserUid(res.data.uid);
            } catch {
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    useEffect(() => {
        if (userUid) fetchConversations();
    }, [userUid]);

    useEffect(() => {
        if (activeConv) {
            fetchMessages(activeConv.uid);

            const channel = window.Echo.private(`chat.${activeConv.uid}`);
            channel.listen('MessageSent', (e: any) => {
                setMessages(prev => {
                    if (prev.find(m => m.uid === e.message.uid)) return prev;
                    return [...prev, e.message];
                });
                fetchConversations();
            });

            return () => {
                window.Echo.leave(`chat.${activeConv.uid}`);
            };
        }
    }, [activeConv]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await axios.get('/api/conversations');
            setConversations(res.data);
            setLoading(false);
            
            // Auto select conversation if conv_id is in URL
            const searchParams = new URLSearchParams(location.search);
            const convId = searchParams.get('conv_id');
            if (convId) {
                const targetConv = res.data.find((c: Conversation) => c.uid === convId);
                if (targetConv) {
                    setActiveConv(targetConv);
                    // Remove param from URL to avoid re-selecting on refresh unnecessarily
                    navigate('/chat', { replace: true });
                }
            }
        } catch {
            setLoading(false);
        }
    };

    const fetchMessages = async (convId: string) => {
        try {
            const res = await axios.get(`/api/conversations/${convId}/messages`);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConv) return;
        const tempMessage = newMessage;
        setNewMessage('');
        setSending(true);
        try {
            const res = await axios.post(`/api/conversations/${activeConv.uid}/messages`, { message: tempMessage });
            setMessages(prev => {
                if (prev.find(m => m.uid === res.data.uid)) return prev;
                return [...prev, res.data];
            });
            fetchConversations();
        } catch {
            setNewMessage(tempMessage);
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div className="h-[calc(100vh-120px)] flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Memuat obrolan...</p>
            </div>
        </div>
    );

    return (
        <div className="py-6 animate-fade-in-up">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-6">Pesan</h1>

            <div className="h-[75vh] flex gap-5">
                {/* Sidebar conversations */}
                <div className={`bg-white w-full md:w-80 rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden shrink-0 ${activeConv ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-slate-100">
                        <h2 className="font-bold text-slate-800">Obrolan</h2>
                        <p className="text-xs text-slate-500 mt-0.5">{conversations.length} percakapan</p>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-3">
                                    <MessageSquare size={28} className="text-slate-300" />
                                </div>
                                <p className="text-sm font-medium text-slate-700 mb-1">Belum ada obrolan</p>
                                <p className="text-xs text-slate-400">Mulai chat dengan penjual dari halaman produk</p>
                            </div>
                        ) : (
                            conversations.map(conv => {
                                const isSeller = conv.user_uid !== userUid;
                                const displayName = isSeller ? conv.user?.name : conv.store?.name;
                                const isActive = activeConv?.uid === conv.uid;
                                return (
                                    <button
                                        key={conv.uid}
                                        onClick={() => setActiveConv(conv)}
                                        className={`w-full p-4 text-left border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 ${isActive ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : ''}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                                {isSeller ? <UserIcon size={18} /> : <Store size={18} />}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <span className={`font-semibold text-sm line-clamp-1 ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>{displayName}</span>
                                                    {conv.unread_count ? (
                                                        <span className="bg-indigo-600 text-white text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shrink-0 ml-1 px-1">
                                                            {conv.unread_count}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="text-xs text-indigo-500 mb-0.5">{isSeller ? 'Pembeli' : 'Penjual'}</div>
                                                <div className="text-xs text-slate-400 line-clamp-1">
                                                    {conv.last_message ? conv.last_message.message : 'Belum ada pesan'}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat area */}
                <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden flex-grow ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
                    {!activeConv ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                                <MessageSquare size={36} className="text-slate-300" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-600 mb-1">Pilih percakapan</h3>
                            <p className="text-sm text-slate-400">Pilih obrolan dari daftar kiri untuk memulai</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat header */}
                            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
                                <button onClick={() => setActiveConv(null)} className="md:hidden p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
                                    <ArrowLeft size={18} />
                                </button>
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                    {activeConv.user_uid !== userUid ? <UserIcon size={18} /> : <Store size={18} />}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-slate-800 text-sm">
                                        {activeConv.user_uid !== userUid ? activeConv.user?.name : activeConv.store?.name}
                                    </h3>
                                    <p className="text-xs text-slate-500">{activeConv.user_uid !== userUid ? 'Pembeli' : 'Penjual'}</p>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-grow overflow-y-auto p-5 bg-slate-50/50 space-y-3">
                                {messages.length === 0 && (
                                    <div className="text-center text-slate-400 text-sm py-8">Belum ada pesan. Mulai percakapan!</div>
                                )}
                                {messages.map(msg => {
                                    const isMe = msg.sender_uid === userUid;
                                    return (
                                        <div key={msg.uid} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[72%] ${isMe
                                                ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-indigo-100'
                                                : 'bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-bl-md shadow-sm'
                                            } px-4 py-2.5`}>
                                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input area */}
                            <div className="p-4 bg-white border-t border-slate-100">
                                <form onSubmit={sendMessage} className="flex gap-2.5 items-end">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        placeholder="Ketik pesan Anda..."
                                        className="flex-grow border border-slate-200 rounded-2xl px-4 py-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || sending}
                                        className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-3 rounded-2xl hover:from-indigo-700 hover:to-violet-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                                    >
                                        {sending
                                            ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                            : <Send size={17} />
                                        }
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Chat;
