import { BrowserRouter, Routes, Route } from "react-router"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Meeting from "./pages/Meeting"
import Home from "./pages/Home"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />           {/* landing page */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/meeting" element={<Meeting />} />   {/* page where they can join / create new meetings */}
        </Routes>

      </BrowserRouter>

    </div>
  )
}

export default App
