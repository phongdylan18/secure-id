import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { useAuth } from '../contexts/AuthContext'
import { CryptoUtils } from '../lib/crypto'
import { generateSecurePassword, calculatePasswordStrength, copyToClipboard } from '../lib/utils'
import { 
  Plus, 
  Search, 
  Eye, 
  EyeOff, 
  Copy, 
  Edit, 
  Trash2,
  Globe,
  User,
  Key as KeyIcon,
  Shield,
  AlertTriangle,
  Shuffle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Password {
  id: number
  name: string
  username: string
  password: string
  website: string
  notes: string
  folder: string
  tags: string[]
  strength: number
  compromised: boolean
  created: number
  updated: number
}

export const PasswordsPage: React.FC = () => {
  const { cryptoKey } = useAuth()
  const [passwords, setPasswords] = useState<Password[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showPasswords, setShowPasswords] = useState<{[key: number]: boolean}>({})
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPassword, setEditingPassword] = useState<Password | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    website: '',
    notes: '',
    folder: 'Default',
    tags: [] as string[]
  })

  useEffect(() => {
    loadPasswords()
  }, [])

  const loadPasswords = async () => {
    // In a real app, this would fetch from the backend and decrypt
    // For now, we'll simulate with sample data
    const samplePasswords: Password[] = [
      {
        id: 1,
        name: 'GitHub',
        username: 'johndoe',
        password: 'SecurePass123!',
        website: 'https://github.com',
        notes: 'Work account',
        folder: 'Work',
        tags: ['development', 'git'],
        strength: 8,
        compromised: false,
        created: Date.now(),
        updated: Date.now()
      },
      {
        id: 2,
        name: 'Gmail',
        username: 'john.doe@gmail.com',
        password: 'weakpass',
        website: 'https://gmail.com',
        notes: 'Personal email',
        folder: 'Personal',
        tags: ['email'],
        strength: 3,
        compromised: true,
        created: Date.now(),
        updated: Date.now()
      }
    ]
    
    setPasswords(samplePasswords)
  }

  const handleAddPassword = async () => {
    if (!formData.name || !formData.username || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }

    const newPassword: Password = {
      id: Date.now(),
      name: formData.name,
      username: formData.username,
      password: formData.password,
      website: formData.website,
      notes: formData.notes,
      folder: formData.folder,
      tags: formData.tags,
      strength: calculatePasswordStrength(formData.password),
      compromised: false,
      created: Date.now(),
      updated: Date.now()
    }

    setPasswords([...passwords, newPassword])
    setIsAddDialogOpen(false)
    resetForm()
    toast.success('Password added successfully!')
  }

  const handleUpdatePassword = async () => {
    if (!editingPassword || !formData.name || !formData.username || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }

    const updatedPassword: Password = {
      ...editingPassword,
      name: formData.name,
      username: formData.username,
      password: formData.password,
      website: formData.website,
      notes: formData.notes,
      folder: formData.folder,
      tags: formData.tags,
      strength: calculatePasswordStrength(formData.password),
      updated: Date.now()
    }

    setPasswords(passwords.map(p => p.id === editingPassword.id ? updatedPassword : p))
    setEditingPassword(null)
    resetForm()
    toast.success('Password updated successfully!')
  }

  const handleDeletePassword = (id: number) => {
    setPasswords(passwords.filter(p => p.id !== id))
    toast.success('Password deleted successfully!')
  }

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      password: '',
      website: '',
      notes: '',
      folder: 'Default',
      tags: []
    })
  }

  const generatePassword = () => {
    const newPassword = generateSecurePassword(16, true, true, true, true)
    setFormData({ ...formData, password: newPassword })
  }

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const copyPassword = async (password: string) => {
    try {
      await copyToClipboard(password)
      toast.success('Password copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy password')
    }
  }

  const getStrengthColor = (strength: number) => {
    if (strength >= 8) return 'bg-green-500'
    if (strength >= 6) return 'bg-yellow-500'
    if (strength >= 4) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getStrengthText = (strength: number) => {
    if (strength >= 8) return 'Strong'
    if (strength >= 6) return 'Good'
    if (strength >= 4) return 'Fair'
    return 'Weak'
  }

  const filteredPasswords = passwords.filter(password =>
    password.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.website.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const startEdit = (password: Password) => {
    setEditingPassword(password)
    setFormData({
      name: password.name,
      username: password.username,
      password: password.password,
      website: password.website,
      notes: password.notes,
      folder: password.folder,
      tags: password.tags
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Passwords</h1>
          <p className="text-muted-foreground">Manage your secure passwords</p>
        </div>
        
        <Dialog open={isAddDialogOpen || !!editingPassword} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            setEditingPassword(null)
            resetForm()
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Password
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingPassword ? 'Edit Password' : 'Add New Password'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., GitHub"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Username *</label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="username@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Folder</label>
                  <Input
                    value={formData.folder}
                    onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                    placeholder="Default"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Password *</label>
                <div className="flex space-x-2">
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                  />
                  <Button type="button" variant="outline" onClick={generatePassword}>
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </div>
                {formData.password && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor(calculatePasswordStrength(formData.password))} transition-all duration-300`}
                        style={{ width: `${(calculatePasswordStrength(formData.password) / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {getStrengthText(calculatePasswordStrength(formData.password))}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false)
                  setEditingPassword(null)
                  resetForm()
                }}>
                  Cancel
                </Button>
                <Button onClick={editingPassword ? handleUpdatePassword : handleAddPassword}>
                  {editingPassword ? 'Update' : 'Add'} Password
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search passwords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Password List */}
      <div className="grid gap-4">
        {filteredPasswords.map((password) => (
          <Card key={password.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <KeyIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{password.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span>{password.username}</span>
                      {password.website && (
                        <>
                          <span>•</span>
                          <Globe className="h-3 w-3" />
                          <span>{password.website}</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={password.compromised ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {password.compromised ? (
                      <>
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Compromised
                      </>
                    ) : (
                      <>
                        <Shield className="mr-1 h-3 w-3" />
                        {getStrengthText(password.strength)}
                      </>
                    )}
                  </Badge>
                  
                  <Button variant="ghost" size="sm" onClick={() => startEdit(password)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeletePassword(password.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-sm font-medium">Password:</span>
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                      {showPasswords[password.id] ? password.password : '••••••••'}
                    </code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePasswordVisibility(password.id)}
                  >
                    {showPasswords[password.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyPassword(password.password)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <span>Strength:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStrengthColor(password.strength)} transition-all duration-300`}
                          style={{ width: `${(password.strength / 10) * 100}%` }}
                        />
                      </div>
                      <span>{password.strength}/10</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <span>Folder:</span>
                    <Badge variant="outline" className="text-xs">
                      {password.folder}
                    </Badge>
                  </div>
                </div>
                
                {password.notes && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Notes:</span> {password.notes}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPasswords.length === 0 && (
        <div className="text-center py-8">
          <KeyIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-muted-foreground">
            {searchTerm ? 'No passwords found' : 'No passwords yet'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first password'}
          </p>
        </div>
      )}
    </div>
  )
}