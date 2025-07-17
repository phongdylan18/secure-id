import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SecureID_backend } from '../../../declarations/SecureID_backend';

const NotesManager = () => {
  const { identity } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const result = await SecureID_backend.getNotes();
      setNotes(result);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await SecureID_backend.updateNote(
          editingId,
          formData.title,
          formData.content
        );
      } else {
        await SecureID_backend.createNote(
          formData.title,
          formData.content
        );
      }
      
      setFormData({ title: '', content: '' });
      setShowForm(false);
      setEditingId(null);
      loadNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleEdit = (note) => {
    setFormData({
      title: note.title,
      content: note.content
    });
    setEditingId(note.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await SecureID_backend.deleteNote(id);
      loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner-large"></div>
        <p className="text-white ml-4">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Secure Notes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-colors"
        >
          Add Note
        </button>
      </div>

      {/* Note Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? 'Edit Note' : 'Add New Note'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ title: '', content: '' });
                }}
                className="text-white/60 hover:text-white/90 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Credit Card Info"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your secure note content..."
                rows={10}
                required
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
              >
                {editingId ? 'Update Note' : 'Save Note'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ title: '', content: '' });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-white/60 text-lg">No notes saved yet</p>
            <p className="text-white/40 text-sm mt-2">Click "Add Note" to get started</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white truncate flex-1 mr-2">
                  {note.title}
                </h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(note)}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 p-2 rounded-xl transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-xl transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="text-white/80 text-sm mb-4 max-h-32 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">{note.content}</pre>
              </div>
              
              <div className="flex justify-between items-center text-xs text-white/50">
                <span>Created: {formatDate(note.created)}</span>
                <span>Updated: {formatDate(note.updated)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesManager;