// attendance-frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import './App.css';

// Protected route component
const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }
        
        if (allowedRoles && !allowedRoles.includes(user.role)) {
          return <Redirect to="/dashboard" />;
        }
        
        return <Component {...props} />;
      }}
    />
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="content">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <ProtectedRoute path="/dashboard" component={Dashboard} />
            <ProtectedRoute 
              path="/records" 
              component={Records} 
              allowedRoles={['admin']} 
            />
            <Redirect to="/" />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;