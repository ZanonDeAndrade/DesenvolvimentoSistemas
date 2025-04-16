import { useNavigate } from "react-router";

export default function NotFound() {
   const navigation = useNavigate();
    return(
        <div>
            <h2>SAI</h2>
            <button onClick={() => navigation('/')}>Voltar</button>
        </div>
    )
}