import { Link } from "react-router"


export default function Header(){
    return(
        <div>
            <h2>Header</h2>
            <nav>
                <li><Link to ={'/'}>Home</Link></li>
                <li><Link to ={'/about'}>About</Link></li>
            </nav>
        </div>
    
    )
};