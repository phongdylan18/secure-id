import React from 'react'
import { Route, Switch } from 'wouter'
import { useAuth } from './contexts/AuthContext'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { PasswordsPage } from './pages/PasswordsPage'
import { TOTPPage } from './pages/TOTPPage'
import { NotesPage } from './pages/NotesPage'
import { SettingsPage } from './pages/SettingsPage'

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/passwords" component={PasswordsPage} />
        <Route path="/totp" component={TOTPPage} />
        <Route path="/notes" component={NotesPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
              <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
            </div>
          </div>
        </Route>
      </Switch>
    </Layout>
  )
}