import React, { useEffect, useState, useRef } from "react";
import { Link, Redirect } from "react-router-dom";

import { StoryItem, useHeadline, StoriesType } from "../interface/items";
import { Loading, UserIcon } from "../component/misc";
import { tsPropertySignature } from "@babel/types";
import { NONAME } from "dns";

function HNHeadline(props: {
  hn_id: number;
  load_state: boolean;
  on_complete: () => void;
  ref?: any;
}) {
  const headline = useHeadline({
    hn_id: props.hn_id,
    component_state: props.on_complete,
  });
  const [hidden, is_hidden] = useState(false);
  const [redirect, set_redirect] = useState(false); //Redirect to comments page

  let story_meta = headline.by ? (
    <div className="p-1 text-gray-100">
      <div className="dim dib">
        <span>
          <span className="mx-1"><UserIcon></UserIcon></span>
          {headline.by}
        </span>
      </div>
      <span className="mx-2">|</span>
      <span
        className="pointer dim dib"
        onClick={(e) => {
          is_hidden(true);
        }}
      >{`hide`}</span>
      <span className="mx-2">|</span>
      <Link className="text-reset text-decoration-none" to={"/item/" + headline.id}>
        {headline.descendants != 0
          ? headline.descendants + " comments"
          : "discuss"}
      </Link>
    </div>
  ) : undefined;

  let headlineElement;
  let createHeadelineElement = (variablePropName: string, variablePropValue: any, headlineTitle: string) => {
    const variableAttribute = { [variablePropName]: variablePropValue };
    return (
      <a className="text-reset text-decoration-none"
        {...variableAttribute} >
        {headlineTitle}
      </a>
    );
  };

  if (headline.url === undefined) {
    headlineElement = createHeadelineElement("onClick", () => set_redirect(true), headline.title);
  }
  else {
    headlineElement = createHeadelineElement("href", headline.url, headline.title)
  }

  return hidden || props.load_state ? null : redirect ? (
    <Redirect push to={`/item/${headline.id}`}></Redirect>
  ) : (
      <li className="list-group-item my-2 border-top br4 v-base">
        <div className="flex items-center">
          <div className="mw3 mh1 text-center v-base">
            <span className="db f6 light-silver">{headline.score}</span>
            <span className="db f6 moon-gray">points</span>
          </div>
          <div>
            <div className="my-1 ml-2 fw5 text-sm-center text-gray-500">
              {headlineElement}
            </div>
            {story_meta}
          </div>
        </div>
      </li>
    );
}

const News: React.FC = (props: any) => {
  const [hn_ids, set_hn_ids]: [Array<number>, any] = useState([]);
  const [load_state, set_loading]: [boolean, any] = useState(true); //true => loading, false => loaded
  const [max_items, set_max_items]: [number, any] = useState(0);
  const ref_load_state = useRef(1);
  const ref_load_elem = useRef();
  let is_mounted = true;

  const location: string = props.match.url.slice(1);

  useEffect(() => {
    //@ts-ignore
    let request = new Request(
      `https://hacker-news.firebaseio.com/v0/${StoriesType[location]}.json`,
      {
        method: "GET",
        cache: "default",
      }
    );

    fetch(request).then((response) => {
      if (is_mounted && response.ok) {
        response.json().then((data) => {
          set_hn_ids(data);
          set_max_items(100 > data.length ? data.length : 100);
        });
      }
    });

    return () => {
      is_mounted = false;
    };
  }, [location]);

  useEffect(() => {
    if (ref_load_elem.current) {
      let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          console.log(entry);
        });
      });
      observer.observe(ref_load_elem.current!);

      return observer.disconnect;
    }
  }, [ref_load_elem]);

  function on_complete(): void {
    ++ref_load_state.current;
    const state = ref_load_state.current < (max_items * 3) / 4;
    if (state != load_state) {
      set_loading(state);
    }
  }

  const items = hn_ids
    .slice(0, max_items)
    .map((num) => (
      <HNHeadline
        hn_id={num}
        key={num}
        load_state={load_state}
        on_complete={on_complete}
      ></HNHeadline>
    ));

  if (items[items.length - 1]) {
    let hn_id = hn_ids[max_items - 1];
    items[items.length - 1] = (
      <HNHeadline
        hn_id={hn_id}
        key={hn_id}
        ref={ref_load_elem}
        load_state={load_state}
        on_complete={on_complete}
      ></HNHeadline>
    );
  }

  return (
    <div className="">
      {[
        <ul className="list-group"> {items} </ul>,
        //@ts-ignore
        load_state ? <Loading></Loading> : null,
      ]}
    </div>
  );
};

export { News };
