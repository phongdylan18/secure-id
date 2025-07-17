import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Shield, Lock, Smartphone, FileText } from 'lucide-react'

export const LoginPage: React.FC = () => {
  const { login } = useAuth()

  const features = [
    {
      icon: Lock,
      title: "Password Manager",
      description: "Securely store and manage all your passwords with AES-256 encryption"
    },
    {
      icon: Smartphone,
      title: "TOTP Authenticator",
      description: "Generate time-based one-time passwords for two-factor authentication"
    },
    {
      icon: FileText,
      title: "Secure Notes",
      description: "Keep your sensitive information safe with encrypted notes"
    },
    {
      icon: Shield,
      title: "Decentralized Security",
      description: "Your data is encrypted client-side and stored on the Internet Computer"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and features */}
        <div className="text-white space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-12 w-12" />
              <h1 className="text-4xl font-bold">SecureID</h1>
            </div>
            <p className="text-xl text-purple-100">
              Your decentralized password manager and authenticator
            </p>
          </div>
          
          <div className="grid gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-purple-100">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right side - Login card */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to SecureID</CardTitle>
            <CardDescription>
              Sign in with Internet Identity to access your secure vault
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🔐 What is Internet Identity?</h4>
                <p className="text-sm text-muted-foreground">
                  Internet Identity is a blockchain-based authentication system that lets you 
                  securely sign into applications without passwords, using biometric authentication 
                  or security keys.
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🛡️ Why is it secure?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• No passwords to remember or steal</li>
                  <li>• Biometric authentication (fingerprint, face)</li>
                  <li>• Decentralized identity on blockchain</li>
                  <li>• End-to-end encryption</li>
                </ul>
              </div>
            </div>
            
            <Button 
              onClick={login} 
              className="w-full h-12 text-lg"
              size="lg"
            >
              <Shield className="mr-2 h-5 w-5" />
              Sign in with Internet Identity
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              By signing in, you agree to our terms of service and privacy policy.
              Your data is encrypted and stored securely on the Internet Computer.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}