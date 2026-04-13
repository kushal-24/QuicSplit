
import LandingPage from './pages/LandingPage'
import './App.css'
import Login from './pages/Login'
import DashBoard from './pages/DashBoard'
import GroupPage from './pages/GroupPage'
import { AuthProvider } from './Context/Auth.Context'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicRoute from "./Routes/PublicRoute.jsx"
import PrivateRoute from "./Routes/PrivateRoute.jsx"
import InvalidRoute from './pages/InvalidRoute.jsx'
import Group2 from './pages/Group2.jsx'

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path='/'
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />
            <Route
              path='/auth'
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
            {/* <Route
              path="/groups/new"
              element={
                <PrivateRoute>
                  <CreateBoard />
                </PrivateRoute>
              }
            /> */}
            <Route
              path="/groups/:groupId"
              element={
                <PrivateRoute>
                  <GroupPage />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={<InvalidRoute />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
