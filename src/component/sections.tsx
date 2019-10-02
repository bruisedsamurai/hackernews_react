import React from "react";


export const Header: React.FC = (props:any) => 
{
    return <header className="mh6">
        <ul className="list flex">
            <li className="pa2">New</li> 
            <li className="pa2">Top</li>
            <li className="pa2">Best</li>
            <li className="pa2">Ask</li>
            <li className="pa2">Show</li>
            <li className="pa2">Job</li>
        </ul>
    </header>
}