import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Progress } from '../components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Badge } from '../components/ui/badge'
import { 
  Plus, 
  Search, 
  Copy, 
  Edit, 
  Trash2,
  Smartphone,
  Clock,
  Shield,
  QrCode,
  Shuffle
} from 'lucide-react'
import { generateRandomSecret, copyToClipboard } from '../lib/utils'
import { TOTP } from 'otpauth'
import toast from 'react-hot-toast'

interface TOTPEntry {
  id: number
  name: string
  issuer: string
  secret: string
  algorithm: string
  digits: number
  period: number
  created: number
  updated: number
}

export const TOTPPage: React.FC = () => {
  const [totpEntries, setTotpEntries] = useState<TOTPEntry[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTOTP, setEditingTOTP] = useState<TOTPEntry | null>(null)
  const [totpCodes, setTotpCodes] = useState<{[key: number]: string}>({})
  const [timeLeft, setTimeLeft] = useState(30)
  
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    secret: '',
    algorithm: 'SHA1',
    digits: 6,
    period: 30
  })

  useEffect(() => {
    loadTOTPs()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const secondsLeft = 30 - Math.floor((now / 1000) % 30)
      setTimeLeft(secondsLeft)
      
      // Generate new codes every 30 seconds
      if (secondsLeft === 30) {
        generateAllCodes()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [totpEntries])

  const loadTOTPs = async () => {
    // Sample data - in real app, this would come from backend
    const sampleTOTPs: TOTPEntry[] = [
      {
        id: 1,
        name: 'GitHub',
        issuer: 'GitHub',
        secret: 'JBSWY3DPEHPK3PXP',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        created: Date.now(),
        updated: Date.now()
      },
      {
        id: 2,
        name: 'AWS',
        issuer: 'Amazon Web Services',
        secret: 'HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        created: Date.now(),
        updated: Date.now()
      }
    ]
    
    setTotpEntries(sampleTOTPs)
    generateAllCodes()
  }

  const generateAllCodes = () => {
    const codes: {[key: number]: string} = {}
    
    totpEntries.forEach(entry => {
      try {
        const totp = new TOTP({
          issuer: entry.issuer,
          label: entry.name,
          secret: entry.secret,
          algorithm: entry.algorithm as any,
          digits: entry.digits,
          period: entry.period
        })
        
        codes[entry.id] = totp.generate()
      } catch (error) {
        console.error('Error generating TOTP for', entry.name, error)
        codes[entry.id] = '000000'
      }
    })
    
    setTotpCodes(codes)
  }

  const handleAddTOTP = async () => {
    if (!formData.name || !formData.issuer || !formData.secret) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate secret key
    if (formData.secret.length < 16) {
      toast.error('Secret key must be at least 16 characters')
      return
    }

    const newTOTP: TOTPEntry = {
      id: Date.now(),
      name: formData.name,
      issuer: formData.issuer,
      secret: formData.secret,
      algorithm: formData.algorithm,
      digits: formData.digits,
      period: formData.period,
      created: Date.now(),
      updated: Date.now()
    }

    setTotpEntries([...totpEntries, newTOTP])
    setIsAddDialogOpen(false)
    resetForm()
    toast.success('TOTP added successfully!')
  }

  const handleUpdateTOTP = async () => {
    if (!editingTOTP || !formData.name || !formData.issuer || !formData.secret) {
      toast.error('Please fill in all required fields')
      return
    }

    const updatedTOTP: TOTPEntry = {
      ...editingTOTP,
      name: formData.name,
      issuer: formData.issuer,
      secret: formData.secret,
      algorithm: formData.algorithm,
      digits: formData.digits,
      period: formData.period,
      updated: Date.now()
    }

    setTotpEntries(totpEntries.map(t => t.id === editingTOTP.id ? updatedTOTP : t))
    setEditingTOTP(null)
    resetForm()
    toast.success('TOTP updated successfully!')
  }

  const handleDeleteTOTP = (id: number) => {
    setTotpEntries(totpEntries.filter(t => t.id !== id))
    toast.success('TOTP deleted successfully!')
  }

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      secret: '',
      algorithm: 'SHA1',
      digits: 6,
      period: 30
    })
  }

  const generateSecret = () => {
    const newSecret = generateRandomSecret()
    setFormData({ ...formData, secret: newSecret })
  }

  const copyCode = async (code: string) => {
    try {
      await copyToClipboard(code)
      toast.success('Code copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const filteredTOTPs = totpEntries.filter(totp =>
    totp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    totp.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const startEdit = (totp: TOTPEntry) => {
    setEditingTOTP(totp)
    setFormData({
      name: totp.name,
      issuer: totp.issuer,
      secret: totp.secret,
      algorithm: totp.algorithm,
      digits: totp.digits,
      period: totp.period
    })
  }

  const progressPercentage = ((30 - timeLeft) / 30) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">TOTP Authenticator</h1>
          <p className="text-muted-foreground">Manage your two-factor authentication codes</p>
        </div>
        
        <Dialog open={isAddDialogOpen || !!editingTOTP} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            setEditingTOTP(null)
            resetForm()
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add TOTP
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingTOTP ? 'Edit TOTP' : 'Add New TOTP'}
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
                  <label className="text-sm font-medium">Issuer *</label>
                  <Input
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g., GitHub Inc."
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Secret Key *</label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={formData.secret}
                    onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                    placeholder="Enter secret key (min 16 chars)"
                  />
                  <Button type="button" variant="outline" onClick={generateSecret}>
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Base32 encoded secret key from your service provider
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Algorithm</label>
                  <select 
                    value={formData.algorithm}
                    onChange={(e) => setFormData({ ...formData, algorithm: e.target.value })}
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                  >
                    <option value="SHA1">SHA1</option>
                    <option value="SHA256">SHA256</option>
                    <option value="SHA512">SHA512</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Digits</label>
                  <select 
                    value={formData.digits}
                    onChange={(e) => setFormData({ ...formData, digits: Number(e.target.value) })}
                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm"
                  >
                    <option value={6}>6</option>
                    <option value={8}>8</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Period (s)</label>
                  <Input
                    type="number"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: Number(e.target.value) })}
                    min="10"
                    max="300"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false)
                  setEditingTOTP(null)
                  resetForm()
                }}>
                  Cancel
                </Button>
                <Button onClick={editingTOTP ? handleUpdateTOTP : handleAddTOTP}>
                  {editingTOTP ? 'Update' : 'Add'} TOTP
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
          placeholder="Search TOTP codes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Timer Progress */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium">Code Refresh Timer</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {timeLeft}s remaining
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            All codes will refresh in {timeLeft} seconds
          </p>
        </CardContent>
      </Card>

      {/* TOTP List */}
      <div className="grid gap-4">
        {filteredTOTPs.map((totp) => (
          <Card key={totp.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{totp.name}</CardTitle>
                    <CardDescription>{totp.issuer}</CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(totp)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteTOTP(totp.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-mono font-bold text-primary">
                      {totpCodes[totp.id] || '------'}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyCode(totpCodes[totp.id] || '')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {totp.digits} digits • {totp.period}s period
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {totp.algorithm}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Active</span>
                  </div>
                  
                  <div className="text-muted-foreground">
                    Created {new Date(totp.created).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTOTPs.length === 0 && (
        <div className="text-center py-8">
          <Smartphone className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-muted-foreground">
            {searchTerm ? 'No TOTP codes found' : 'No TOTP codes yet'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first TOTP code'}
          </p>
        </div>
      )}
    </div>
  )
}