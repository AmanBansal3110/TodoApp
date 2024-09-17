import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Correct import
import SignIn from './pages/signin';
import Home from './pages/Home';
import SignUp from './pages/signup';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
