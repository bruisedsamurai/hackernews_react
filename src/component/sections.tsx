import React from "react";
import {Link} from "react-router-dom"


export const Header: React.FC = (props:any) => 
{
    return <header className="mh6-ns">
        <ul className="list flex pl0 f5-ns f6 mh1">
            <li className="pa2-ns pa1"><Link className="no-underline black dim" to="/new">New</Link></li> 
            <li className="pa2-ns pa1"><Link className="no-underline black dim" to="/top">Top</Link></li>
            <li className="pa2-ns pa1"><Link className="no-underline black dim" to="/best">Best</Link></li>
            <li className="pa2-ns pa1"><Link className="no-underline black dim" to="/ask">Ask</Link></li>
            <li className="pa2-ns pa1"><Link className="no-underline black dim" to="/show">Show</Link></li>
            <li className="pa2-ns pa1"><Link className="no-underline black dim" to="/job">Job</Link></li>
        </ul>
    </header>
}