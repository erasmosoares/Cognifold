import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import { Routes, Route, HashRouter } from 'react-router-dom'
import SidebarWithHeader from './components/modules/sidebar/SidebarWithHeader';

function App() {
  return (
    <HashRouter> 
       <Routes>    
      <Route index element={<SidebarWithHeader />} />    
      </Routes>
    </HashRouter>
  );
}

export default App;

{/* SETUP WITH AUTHENTICATION
  import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import { useContext } from 'react'
import { Navigate, Outlet, BrowserRouter } from 'react-router-dom'
import { Routes, Route, HashRouter } from 'react-router-dom'
import SignIn from './components/modules/authentication/SignIn';
import Signup from './components/modules/authentication/SignUp';
import { AuthContext } from './components/modules/authentication/AuthContext';
import SidebarWithHeader from './components/modules/sidebar/SidebarWithHeader'

function App() {

 // PrivateRoutes component to protect routes
  const PrivateRoutes = () => {
    const { authenticated } = useContext(AuthContext);  
    
    console.log(`Is authenticated: ${authenticated}`);

    if (!authenticated) return <Navigate to='/signin' replace />; 
    
    return <Outlet />;  
  }; 

  return (
    <HashRouter> 
    <Routes>    
    <Route index element={<Signup/>}/>
    <Route path='signup' element={<Signup />} />
    <Route path='signin' element={<SignIn />} />

     <Route element={<PrivateRoutes />}>
        <Route path='dashboard' element={<SidebarWithHeader />} />        
      </Route> 
    </Routes> 
  </HashRouter>
);
}

export default App;
  */}