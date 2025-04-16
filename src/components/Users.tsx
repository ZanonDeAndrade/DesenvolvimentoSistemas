import { useEffect, useState } from "react";


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
        <h2>Users</h2>
    )
};