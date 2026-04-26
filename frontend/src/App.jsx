
import LandingPage from './pages/LandingPage'
import './App.css'
import Login from './pages/Login'
import DashBoard from './pages/DashBoard'
import GroupPage from './pages/GroupPage'
import { AuthProvider } from './Context/Auth.Context'
import { ThemeProvider } from './Context/Theme.Context'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicRoute from "./Routes/PublicRoute.jsx"
import PrivateRoute from "./Routes/PrivateRoute.jsx"
import InvalidRoute from './pages/InvalidRoute.jsx'
import SettingsPage from './pages/Settings.jsx'

function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* ... existing routes ... */}
              <Route
                path='/'
                element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                }
              />
              <Route
                path='/login'
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Private routes */}
              <Route
                path='/dashboard'
                element={
                  <PrivateRoute>
                    <DashBoard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/groups/:groupId"
                element={
                  <PrivateRoute>
                    <GroupPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                element={<InvalidRoute />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}

export default App
