import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios"

export function Signup() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword , setConfirmPassword] = useState("")
    
    const handleSubmit = async (e)=> {
        if(password !== confirmPassword){
            return alert("Passwords dont match. Retry again")
        }
        const userBody = {
            username,
            email,
            password,
        }
        
        try{
            const response = await axios.post("http://localhost:3001/signup", 
                {
                    username: userBody.username,
                    email : userBody.email,
                    password: userBody.password
                }
            )
            if(response){
                navigate("/signin")
            }
        }
        catch(err){
            if(err.status == 409){   
                alert("User already exists")
            }
            else{
                alert("Bad request.")
            }
        } 
    }

    return <div>
        <div>
            <div>
                <h2>Sign Up</h2>
            </div>
            <div>
                <div>
                    <label>Username: </label>
                    <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div>
                    <label>Email:  </label>
                    <input type="text" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div>
                    <label>Password: </label>
                    <input type="text" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div>
                    <label>Re-enter Password: </label>
                    <input type="text" placeholder="Re-enter Password" value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} />
                </div>
                <button onClick={handleSubmit} >Sign up</button>

                <div>
                    <p>
                        Already have an account? {' '}
                        <span onClick={()=> navigate('/signin')}>Login</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
}

export default Signup;