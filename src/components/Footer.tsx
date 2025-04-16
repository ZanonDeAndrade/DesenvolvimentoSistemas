import { Link } from "react-router"


export default function Footer(){
    return(
        <div>
            <h2>Footer</h2>
            <nav>
                <li><Link to ={'/'}>Home</Link></li>
                <li><Link to ={'/about'}>About</Link></li>
            </nav>
        </div>
    
    )
};