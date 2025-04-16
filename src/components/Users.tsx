import { useEffect, useState } from "react";
import { Link } from "react-router";


export default function Users(){
    
    const [ users, setUsers ] = useState([]);

    const fetchUsers = async () => {
        const response = await fetch("https://jsonplaceholder.typicode.com/users")
        const usersData = await response.json();
        setUsers(usersData);
    }

    useEffect(() => {
        fetchUsers();
    }, [])
    
    return(
        <div>
            <h2>Users</h2>
            {users.map((user: any) => (
                <div>
                    <p>{user.id}</p>
                    <p>{user.name}</p>
                    <Link to ={`/users/${user.id}`}> Ver Detalhes </Link>
                </div>
            ))}
        </div>
    )
};