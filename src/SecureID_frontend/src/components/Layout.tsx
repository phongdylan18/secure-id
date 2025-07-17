import React from 'react'
import { Link, useLocation } from 'wouter'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { 
  Shield, 
  Key, 
  Smartphone, 
  FileText, 
  Settings, 
  LogOut, 
  Home,
  Sun,
  Moon
} from 'lucide-react'
import { cn } from '../lib/utils'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, principal } = useAuth()
  const [location] = useLocation()
  const [darkMode, setDarkMode] = React.useState(false)

  React.useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Passwords', href: '/passwords', icon: Key },
    { name: 'TOTP', href: '/totp', icon: Smartphone },
    { name: 'Notes', href: '/notes', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">SecureID</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <div className="text-sm text-muted-foreground">
                {principal?.toString().slice(0, 8)}...
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card min-h-[calc(100vh-81px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location === item.href
                
                return (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <a
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </a>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}