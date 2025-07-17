import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { 
  Settings, 
  Shield, 
  Moon, 
  Sun, 
  Clock, 
  Clipboard,
  Eye,
  AlertTriangle,
  Download,
  Upload,
  Trash2,
  Key
} from 'lucide-react'
import toast from 'react-hot-toast'

export const SettingsPage: React.FC = () => {
  const { principal, logout } = useAuth()
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  )
  const [settings, setSettings] = useState({
    autoLock: 15,
    clipboardClear: 30,
    showStrength: true,
    compromisedCheck: true,
    theme: darkMode ? 'dark' : 'light'
  })

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    setSettings({ ...settings, theme: newDarkMode ? 'dark' : 'light' })
    toast.success(`${newDarkMode ? 'Dark' : 'Light'} mode enabled`)
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value })
    toast.success('Settings updated')
  }

  const handleExportData = () => {
    // In a real app, this would export encrypted data
    toast.success('Export functionality would be implemented here')
  }

  const handleImportData = () => {
    // In a real app, this would import encrypted data
    toast.success('Import functionality would be implemented here')
  }

  const handleDeleteAccount = () => {
    // In a real app, this would delete the user's account and data
    toast.error('Account deletion would be implemented here')
  }

  const settingsCategories = [
    {
      title: 'Appearance',
      icon: darkMode ? Moon : Sun,
      items: [
        {
          name: 'Dark Mode',
          description: 'Switch between light and dark themes',
          type: 'toggle',
          value: darkMode,
          onChange: handleToggleDarkMode
        }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        {
          name: 'Auto-Lock Timer',
          description: 'Minutes before automatic lock',
          type: 'select',
          value: settings.autoLock,
          options: [
            { value: 5, label: '5 minutes' },
            { value: 15, label: '15 minutes' },
            { value: 30, label: '30 minutes' },
            { value: 60, label: '1 hour' },
            { value: 0, label: 'Never' }
          ],
          onChange: (value: number) => handleSettingChange('autoLock', value)
        },
        {
          name: 'Clipboard Clear',
          description: 'Seconds before clipboard is cleared',
          type: 'select',
          value: settings.clipboardClear,
          options: [
            { value: 10, label: '10 seconds' },
            { value: 30, label: '30 seconds' },
            { value: 60, label: '1 minute' },
            { value: 300, label: '5 minutes' },
            { value: 0, label: 'Never' }
          ],
          onChange: (value: number) => handleSettingChange('clipboardClear', value)
        },
        {
          name: 'Show Password Strength',
          description: 'Display password strength indicators',
          type: 'toggle',
          value: settings.showStrength,
          onChange: (value: boolean) => handleSettingChange('showStrength', value)
        },
        {
          name: 'Compromised Password Check',
          description: 'Check passwords against known breaches',
          type: 'toggle',
          value: settings.compromisedCheck,
          onChange: (value: boolean) => handleSettingChange('compromisedCheck', value)
        }
      ]
    },
    {
      title: 'Data Management',
      icon: Download,
      items: [
        {
          name: 'Export Data',
          description: 'Download encrypted backup of your data',
          type: 'button',
          buttonText: 'Export',
          onClick: handleExportData
        },
        {
          name: 'Import Data',
          description: 'Import encrypted backup data',
          type: 'button',
          buttonText: 'Import',
          onClick: handleImportData
        }
      ]
    },
    {
      title: 'Account',
      icon: Key,
      items: [
        {
          name: 'Delete Account',
          description: 'Permanently delete your account and all data',
          type: 'button',
          buttonText: 'Delete Account',
          variant: 'destructive',
          onClick: handleDeleteAccount
        }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your SecureID preferences</p>
        </div>
        
        <Button variant="outline" onClick={logout}>
          Sign Out
        </Button>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Account Information</span>
          </CardTitle>
          <CardDescription>
            Your Internet Identity and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Principal ID</div>
              <div className="text-sm text-muted-foreground font-mono">
                {principal?.toString()}
              </div>
            </div>
            <Badge variant="outline">
              <Shield className="mr-1 h-3 w-3" />
              Internet Identity
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium">Account Type</div>
              <div className="text-muted-foreground">Personal</div>
            </div>
            <div>
              <div className="font-medium">Created</div>
              <div className="text-muted-foreground">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Categories */}
      {settingsCategories.map((category, categoryIndex) => {
        const Icon = category.icon
        return (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icon className="h-5 w-5" />
                <span>{category.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.type === 'toggle' && (
                      <Button
                        variant={item.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => item.onChange(!item.value)}
                      >
                        {item.value ? 'ON' : 'OFF'}
                      </Button>
                    )}
                    
                    {item.type === 'select' && (
                      <select
                        value={item.value}
                        onChange={(e) => item.onChange(Number(e.target.value))}
                        className="w-32 h-8 px-2 py-1 bg-background border border-input rounded-md text-sm"
                      >
                        {item.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {item.type === 'button' && (
                      <Button
                        variant={item.variant as any || "outline"}
                        size="sm"
                        onClick={item.onClick}
                      >
                        {item.buttonText}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}

      {/* Privacy & Security Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Privacy & Security</span>
          </CardTitle>
          <CardDescription>
            How SecureID protects your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium">End-to-End Encryption</div>
                <div className="text-sm text-muted-foreground">
                  All your data is encrypted with AES-256 before being stored
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Key className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Client-Side Encryption</div>
                <div className="text-sm text-muted-foreground">
                  Your encryption keys never leave your device
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Decentralized Storage</div>
                <div className="text-sm text-muted-foreground">
                  Data is stored on the Internet Computer blockchain
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              SecureID v1.0.0
            </div>
            <div className="text-xs text-muted-foreground">
              Built with ❤️ on the Internet Computer
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}