import { BrowserRouter, Routes, Route } from "react-router"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Home from "./pages/Home"
import Landing from "./pages/Landing"
import Discussion from "./pages/Discussion"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />           {/* landing page */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/discussion" element={<Discussion />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
