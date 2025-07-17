import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  FileText,
  Folder,
  Tag,
  Clock
} from 'lucide-react'
import { formatTimestamp } from '../lib/utils'
import toast from 'react-hot-toast'

interface SecureNote {
  id: number
  title: string
  content: string
  folder: string
  tags: string[]
  created: number
  updated: number
  accessed: number
}

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<SecureNote[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string>('All')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<SecureNote | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    folder: 'Personal',
    tags: [] as string[],
    tagInput: ''
  })

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    // Sample data - in real app, this would come from backend
    const sampleNotes: SecureNote[] = [
      {
        id: 1,
        title: 'Bitcoin Wallet Recovery',
        content: 'Recovery phrase: abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about\n\nWallet address: 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2\n\nImportant: Keep this information secure and never share it online.',
        folder: 'Cryptocurrency',
        tags: ['wallet', 'recovery', 'bitcoin'],
        created: Date.now() - 86400000,
        updated: Date.now() - 86400000,
        accessed: Date.now()
      },
      {
        id: 2,
        title: 'Server SSH Keys',
        content: 'Production Server SSH Key:\n\n-----BEGIN OPENSSH PRIVATE KEY-----\n[KEY CONTENT WOULD BE HERE]\n-----END OPENSSH PRIVATE KEY-----\n\nServer IP: 192.168.1.100\nUsername: root\nPort: 22',
        folder: 'Work',
        tags: ['ssh', 'server', 'production'],
        created: Date.now() - 172800000,
        updated: Date.now() - 172800000,
        accessed: Date.now()
      },
      {
        id: 3,
        title: 'Emergency Contacts',
        content: 'Important contacts for emergencies:\n\nBank: 1-800-123-4567\nCredit Card: 1-800-987-6543\nInsurance: 1-800-555-0123\n\nDoctor: Dr. Smith - 555-0199\nEmergency Contact: Jane Doe - 555-0188',
        folder: 'Personal',
        tags: ['contacts', 'emergency', 'important'],
        created: Date.now() - 259200000,
        updated: Date.now() - 259200000,
        accessed: Date.now()
      }
    ]
    
    setNotes(sampleNotes)
  }

  const handleAddNote = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Please fill in title and content')
      return
    }

    const newNote: SecureNote = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      folder: formData.folder,
      tags: formData.tags,
      created: Date.now(),
      updated: Date.now(),
      accessed: Date.now()
    }

    setNotes([...notes, newNote])
    setIsAddDialogOpen(false)
    resetForm()
    toast.success('Note added successfully!')
  }

  const handleUpdateNote = async () => {
    if (!editingNote || !formData.title || !formData.content) {
      toast.error('Please fill in title and content')
      return
    }

    const updatedNote: SecureNote = {
      ...editingNote,
      title: formData.title,
      content: formData.content,
      folder: formData.folder,
      tags: formData.tags,
      updated: Date.now(),
      accessed: Date.now()
    }

    setNotes(notes.map(n => n.id === editingNote.id ? updatedNote : n))
    setEditingNote(null)
    resetForm()
    toast.success('Note updated successfully!')
  }

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id))
    toast.success('Note deleted successfully!')
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      folder: 'Personal',
      tags: [],
      tagInput: ''
    })
  }

  const addTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: ''
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const startEdit = (note: SecureNote) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      folder: note.folder,
      tags: note.tags,
      tagInput: ''
    })
  }

  const folders = Array.from(new Set(['All', ...notes.map(note => note.folder)]))

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFolder = selectedFolder === 'All' || note.folder === selectedFolder
    
    return matchesSearch && matchesFolder
  })

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Secure Notes</h1>
          <p className="text-muted-foreground">Store sensitive information securely</p>
        </div>
        
        <Dialog open={isAddDialogOpen || !!editingNote} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            setEditingNote(null)
            resetForm()
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter note title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Folder</label>
                  <Input
                    value={formData.folder}
                    onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                    placeholder="Personal"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter your secure note content..."
                  className="w-full min-h-[200px] px-3 py-2 bg-background border border-input rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Tags</label>
                <div className="flex space-x-2">
                  <Input
                    value={formData.tagInput}
                    onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false)
                  setEditingNote(null)
                  resetForm()
                }}>
                  Cancel
                </Button>
                <Button onClick={editingNote ? handleUpdateNote : handleAddNote}>
                  {editingNote ? 'Update' : 'Add'} Note
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex space-x-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Folder Filter */}
        <div className="w-48">
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
          >
            {folders.map(folder => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="relative h-fit">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{note.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Folder className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{note.folder}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(note)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <pre className="whitespace-pre-wrap font-sans">
                  {truncateContent(note.content)}
                </pre>
              </div>
              
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Updated {new Date(note.updated).toLocaleDateString()}</span>
                </div>
                <div>
                  {note.content.length} chars
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-muted-foreground">
            {searchTerm ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first secure note'}
          </p>
        </div>
      )}
    </div>
  )
}