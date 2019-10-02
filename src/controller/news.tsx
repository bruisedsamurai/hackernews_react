import React, { useEffect, useState, useRef } from "react";
import { Link, Redirect } from 'react-router-dom'

import {StoryItem, useHeadline, ComponentState} from '../model/items';
import {Loading} from '../component/misc'



function HNHeadline(props:{hn_id:number, load_state:boolean, on_complete: ()=> void}){

  const headline = useHeadline({hn_id:props.hn_id, component_state:props.on_complete });
  const [hidden, is_hidden] = useState(false);
  const [redirect, set_redirect] = useState(false); //Redirect to comments page


  let story_meta = headline.by? 
  (<div className="ma1 f6 flex">{`${headline.score} by ${headline.by}`} 
    <span className="pointer dim mh1" onClick={(e)=>{is_hidden(true)}}>{`| hide |`}</span>
    <Link className="no-underline black dim" to={"/item/" + headline.id}>{`${headline.descendants || 0} comments`}</Link>
  </div>) : undefined;

  return (
  (hidden || props.load_state)? null:
  (redirect? <Redirect push to={`/item/${headline.id}`}></Redirect> 
  : <li className="ma2-ns ma1 pa3-ns pa2 br2 shadow-4 pointer" onClick={()=>set_redirect(true)}>
    <a className="no-underline orange dim ma1-ns f4-ns f5" href={headline.url}>{headline.title}</a>
    {story_meta}
  </li>));
}

const News: React.FC = (props) => {

  const [hn_ids, set_hn_ids]: [Array<number>, any] = useState([]);
  const [load_state, set_loading]: [boolean, any] = useState(true);
  const [max_items, set_max_items]: [number, any] = useState(100);
  const ref_load_state = useRef(1);

  let is_mounted:boolean = true;

  useEffect(()=> {
    let request = new Request("https://hacker-news.firebaseio.com/v0/topstories.json"
    , {
      method:"GET",
      cache: "default",
    })

    fetch(request)
    .then((response)=>{
      if(is_mounted)
      {
       if(response.ok) 
       {
         response.json().then(data=>{set_hn_ids(data)});
       }
      }
    })

    return (()=>
    {
      is_mounted = false;
    })
  }, [])

  function on_complete(): void 
  {
    ++ref_load_state.current;
    const state = (ref_load_state.current < max_items);
    if(state != load_state)
    {
      set_loading(state);
      window.scrollTo(0,0); 
    }
  }

  const items = hn_ids.slice(0,max_items)
  .map((num, index) =><HNHeadline hn_id = {num} key={index} load_state={load_state} on_complete={on_complete}></HNHeadline>);

  return (
      <div className="">{[
      <ol className="mv2-ns list pl0 mh6-ns mh4-m mh1 ba b--light-silver"> {items} </ol>,
      (ref_load_state.current < 10 ? <Loading></Loading> : null)
    ]}
    </div>
  );
}





export {News}