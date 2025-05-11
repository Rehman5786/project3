import { useState,useEffect } from "react";

const Arth =()=>{
    const[x,setx]=useState(100);
    const[y,sety]=useState(200);
    useEffect(
        ()=>{
            setx(400)
        }

    )
    const[bool,setBool]=useEffect(true);
    const[str,setStr]=useState('gopi');
    return(
        <>
        <p>{str}</p>
        <p>{JSON.stringify(bool)}</p>
        <p>This is addition of two numbers</p>
        <p>{x}</p>
        <p>{y}</p>
        <h1>Addition of x and y is {x+y}</h1>
        <h1>Subraction of x and y is {x-y}</h1>
        <h1>Multiplication of x and y is {x*y}</h1>
        <h1>Division of x and y is {x/y}</h1>




        </>
    )

};
export default Arth;