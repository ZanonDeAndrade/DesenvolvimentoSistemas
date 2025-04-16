import { useParams } from "react-router";
import { useState } from "react";
import { useEffect } from "react";


export default function User(){
    const {id} = useParams();

     const [ user, setUser ] = useState <any>();
    
        const fetchUser = async () => {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
            const userData = await response.json();
            setUser(userData);
        }
    
        useEffect(() => {
            fetchUser();
        }, [])

    return(
        <div>
            <h2>User</h2>
            <p>{user && user.id}</p>
            <p>{user && user.name}</p>
        </div>
    )
}