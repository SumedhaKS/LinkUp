import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export function Signin() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignin = async () => {
        const userBody = {
            email,
            password
        }
        try {
            const response = await axios.post("http://localhost:3001/signin",
                {
                    email: userBody.email,
                    password: userBody.password
                }
            )
            if (response) {
                localStorage.setItem("token" , response.data.token)
                navigate("/landing")
            }
        }
        catch(err){
            if(err.status == 404){
                alert("Invalid credentials.")
            }
            else{
                alert("Bad request.")
            }
        }
    }

    return <div>
        <div>
            <h2>Sign In</h2>
        </div>
        <div>
            <div>
                <label>Email: </label>
                <input type="text" placeholder="Enter registered email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
                <label>Password: </label>
                <input type="text" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button onClick={handleSignin}>Login</button>
        </div>
    </div>
}

export default Signin;