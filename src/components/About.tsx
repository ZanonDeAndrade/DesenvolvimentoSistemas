import { useSearchParams } from "react-router";

function About (){
    const [searchParams] = useSearchParams();
    const term = searchParams.get('term');
    const admin = searchParams.get('admin');
    const consulta= searchParams.get('consulta');

    return (<>
        <div>Termo de busca: {term}</div>;
        <div>Termo de admin {admin}</div>;
        <div>Consulta {consulta}</div>;
        </>);
}


export default About;