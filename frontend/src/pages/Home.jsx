import { useNavigate } from "react-router";

export function Home() {
    const navigate = useNavigate()
    return <div>
        <h2>
            Home Page
        </h2>
        <br />
        <br />
        <h4>Welcome</h4>
        <div>
            <button onClick={()=> navigate('/signup')} >Sign Up</button>
            <button onClick={()=> navigate('/signin')} >Sign In</button>
        </div>
        
    </div>
}

export default Home;