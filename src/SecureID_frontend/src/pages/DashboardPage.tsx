import React, { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { 
  Key, 
  Smartphone, 
  FileText, 
  Plus, 
  TrendingUp, 
  Shield,
  AlertTriangle,
  Activity
} from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { principal } = useAuth()
  const [stats, setStats] = useState({
    totalPasswords: 0,
    totalTOTPs: 0,
    totalNotes: 0,
    totalUsers: 0
  })

  useEffect(() => {
    // In a real app, you would fetch these stats from the backend
    // For now, we'll simulate some data
    setStats({
      totalPasswords: 12,
      totalTOTPs: 8,
      totalNotes: 5,
      totalUsers: 1
    })
  }, [])

  const quickActions = [
    {
      title: "Add Password",
      description: "Store a new password securely",
      icon: Key,
      href: "/passwords",
      color: "bg-blue-500"
    },
    {
      title: "Add TOTP",
      description: "Set up two-factor authentication",
      icon: Smartphone,
      href: "/totp",
      color: "bg-green-500"
    },
    {
      title: "Add Note",
      description: "Create a secure note",
      icon: FileText,
      href: "/notes",
      color: "bg-purple-500"
    }
  ]

  const securityMetrics = [
    {
      label: "Strong Passwords",
      value: "10/12",
      percentage: 83,
      color: "bg-green-500"
    },
    {
      label: "Compromised",
      value: "2/12",
      percentage: 17,
      color: "bg-red-500"
    },
    {
      label: "2FA Enabled",
      value: "8/12",
      percentage: 67,
      color: "bg-blue-500"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your secure vault</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Shield className="mr-1 h-4 w-4" />
          Secure
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passwords</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPasswords}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              2 added this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TOTP Codes</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTOTPs}</div>
            <p className="text-xs text-muted-foreground">
              <Activity className="inline h-3 w-3 mr-1" />
              All active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secure Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotes}</div>
            <p className="text-xs text-muted-foreground">
              <Shield className="inline h-3 w-3 mr-1" />
              Encrypted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Good security posture
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can perform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} href={action.href}>
                  <Button variant="ghost" className="w-full justify-start h-auto p-4">
                    <div className={`p-2 rounded-lg ${action.color} text-white mr-4`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        {/* Security Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Security Overview</CardTitle>
            <CardDescription>
              Your password security metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {securityMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{metric.label}</span>
                  <span className="text-muted-foreground">{metric.value}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${metric.color} transition-all duration-300`}
                    style={{ width: `${metric.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest actions in SecureID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Key className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Updated password for GitHub</div>
                <div className="text-muted-foreground">2 hours ago</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="bg-green-100 p-2 rounded-lg">
                <Smartphone className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Added TOTP for AWS</div>
                <div className="text-muted-foreground">1 day ago</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="bg-purple-100 p-2 rounded-lg">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Created secure note</div>
                <div className="text-muted-foreground">3 days ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}