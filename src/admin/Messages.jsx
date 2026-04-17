import { useState, useEffect, useCallback } from 'react';
import { contactAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaCheck } from 'react-icons/fa';

const Messages = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await contactAPI.getAll(params);
      setMessages(res.data.messages);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      try {
        await contactAPI.updateStatus(message._id, 'read');
        fetchMessages();
      } catch (error) {
        console.error('Failed to mark as read');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await contactAPI.delete(id);
      toast.success('Message deleted');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleMarkAsReplied = async (id) => {
    try {
      await contactAPI.updateStatus(id, 'replied');
      toast.success('Marked as replied');
      fetchMessages();
      setSelectedMessage(null);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Messages Inbox</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Contact form submissions from your portfolio</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {['all', 'unread', 'read', 'replied'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Message List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 max-h-[600px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <FaEnvelope size={40} className="mx-auto mb-3 opacity-50" />
              <p>No messages found</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                onClick={() => handleSelectMessage(message)}
                className={`p-3 rounded-lg cursor-pointer transition mb-2 ${
                  selectedMessage?._id === message._id
                    ? 'bg-primary/10 border border-primary/30'
                    : message.status === 'unread'
                    ? 'bg-slate-50 dark:bg-slate-700/50 border-l-4 border-primary'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg text-slate-500 dark:text-slate-400">
                    {message.status === 'unread' ? <FaEnvelope /> : <FaEnvelopeOpen />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white truncate">{message.name}</span>
                      {message.status === 'unread' && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 truncate">{message.subject}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">
                      {format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 sm:p-6">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{selectedMessage.subject}</h2>
                {isSuperAdmin && (
                  <div className="flex gap-2">
                    {selectedMessage.status !== 'replied' && (
                      <button
                        onClick={() => handleMarkAsReplied(selectedMessage._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 text-sm"
                      >
                        <FaCheck /> Mark Replied
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedMessage._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 text-sm"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-slate-700 dark:text-slate-300">From:</span> {selectedMessage.name} ({selectedMessage.email})</p>
                {selectedMessage.phone && <p><span className="font-medium text-slate-700 dark:text-slate-300">Phone:</span> {selectedMessage.phone}</p>}
                {selectedMessage.company && <p><span className="font-medium text-slate-700 dark:text-slate-300">Company:</span> {selectedMessage.company}</p>}
                <p><span className="font-medium text-slate-700 dark:text-slate-300">Received:</span> {format(new Date(selectedMessage.createdAt), 'MMMM dd, yyyy HH:mm')}</p>
                <p><span className="font-medium text-slate-700 dark:text-slate-300">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    selectedMessage.status === 'unread' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                    selectedMessage.status === 'read' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {selectedMessage.status}
                  </span>
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-medium text-slate-900 dark:text-white mb-2">Message:</h3>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 dark:text-slate-400">
              <FaEnvelope size={60} className="mx-auto mb-4 opacity-50" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;