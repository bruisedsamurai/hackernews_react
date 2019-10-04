import React, { useEffect, useRef, useState } from "react";
import {Link} from 'react-router-dom';

import {CommentItemInterface, CommentItem, StoryItem, useHeadline} from '../model/items';
import {Loading} from '../component/misc'
import { clone } from "@babel/types";


enum LoadingState{
  COMPLETE,
  PROCESSING,
}

function Comment(props:{hn_id:number, loading_state: any, on_load: ()=> void})
{

  const [hn_comment,set_hn_comment]: [CommentItemInterface, any] = useState(new CommentItem({}));
  const [loading_state, set_loading_state] = useState(LoadingState.PROCESSING); 
  const loaded_elements = useRef(0);
  const is_mounted = useRef(true);

  useEffect(()=>
  {
    let request = new Request("https://hacker-news.firebaseio.com/v0/item/" + props.hn_id + ".json",
    {
      method: "GET",
      cache: "default",
    })

    async function get_data()
    {
      let response = await fetch(request);
        if(response.ok)
        {
          let data = await response.json();
          return data;
        }
    }

    if(is_mounted.current == true)
    {
      get_data().then(data=>{
        set_hn_comment(new CommentItem(data));
        if(!data.kids) props.on_load();
      })
    }
    return (()=>
    {
      is_mounted.current = false;
    })
  },[props.hn_id]) 

  useEffect(()=>{
    if(loading_state == LoadingState.COMPLETE) props.on_load(); 
  })

  function on_load()
  {
    ++loaded_elements.current; 
    const state = loaded_elements.current > (hn_comment.kids.length - 2)? LoadingState.COMPLETE: LoadingState.PROCESSING;
    if(loading_state != state)
      set_loading_state(state);
  }

  function create_comment()
  {
    let child_comments,comment_text,comment_meta;

    if (hn_comment.is_valid)
    {
        comment_meta = <summary className="mb2 f6 pa1">{hn_comment.by + ` ${hn_comment.time}`}</summary>;
        comment_text = <p className="near-black mh2 pa2-ns pa1">
          <span className="w-100" dangerouslySetInnerHTML={{__html:hn_comment.text}}></span>
        </p>;
        child_comments = (hn_comment.kids && hn_comment.kids.length) 
        ? hn_comment.kids.map(
          (id, index) => <Comment key={index} loading_state={loading_state} on_load={on_load} hn_id={id as number}></Comment>
          ) 
        : null;
    }

    return [child_comments, comment_text, comment_meta];
  }

  const [child_comments, comment_text, comment_meta] = [...create_comment()];

    return (
    <details id="icon" className="mw-100 mt2-ns mv1-m mt1 mb0 ml3-ns ml1 mr0 f5-ns f6 bl br1 b--black-20 shadow-6" 
    open hidden={(props.loading_state == LoadingState.PROCESSING) || !hn_comment.is_valid? true: false}>
    {comment_meta}
    {comment_text}
    {child_comments}
  </details>);
  
}

const Comments: React.FC = (props:any) =>
{
  const temp:StoryItem = {
    id:0,
    url:"",
    descendants:0,
    score:0,
    type:"",
    by:"",
    time:0,
    kids:[],
    title:"",
  }
  const hn_id = props.match.params.id;


  const headline: StoryItem = useHeadline({hn_id:hn_id,});
  const [loading_state, set_loading_state]: [LoadingState, any] = useState(LoadingState.PROCESSING); //true means processing, false means done.
  const loaded_elements = useRef(0);

  function on_load()
  {
    ++loaded_elements.current;
    let state;
    state = loaded_elements.current > (headline.kids.length - 2) ? LoadingState.COMPLETE : LoadingState.PROCESSING;
    if(state != loading_state){
      set_loading_state(state);
      window.scrollTo(0,0);
    }
  }

  let story_meta = headline && headline.by? 
  ( <div className="mv2 mh3">
      <a className="no-underline orange dim ma1 f4-ns f5" href={headline.url}>{headline.title}</a>
      <br></br>
      <span className="ma1 f6">{`${headline.score} points by ${headline.by} | `}
        <Link className="no-underline black dim" to={"/item/" + headline.id}>{`${headline.descendants} comments`}</Link>
      </span>
      {headline.text? 
        <p className="pa2-ns pa1 f5 ba br2 b--light-gray shadow-3" dangerouslySetInnerHTML={{__html:headline.text}}></p> : null }
    </div>) : undefined;


  let comment, key: number;

  if(headline.kids.length)
    comment = headline.kids.map((id, index)=> <Comment key={index} hn_id={id} loading_state={loading_state} on_load={on_load}></Comment>)

  return (
    <article className="">
      <div className="mh6-ns mh4-m mh1 ba b--light-gray">
        {story_meta}
        <section className="mv4" hidden={loading_state == LoadingState.PROCESSING? true: false}>
          {comment}
        </section>
        {loading_state == LoadingState.PROCESSING? <Loading></Loading> : null}
      </div>
    </article>
  )
}


export {Comments}