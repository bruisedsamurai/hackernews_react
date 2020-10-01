import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  CommentItemInterface,
  CommentItem,
  StoryItem,
  useHeadline,
} from "../interface/items";
import { Loading, CaretDown } from "../component/misc";
import { clone } from "@babel/types";
import { HNStoryCard } from "../controller/news";
import { LoadState } from "../interface/enums";
import { useItem } from "./hooks";

enum LoadingState {
  COMPLETE,
  PROCESSING,
}

function Comment(props: {
  hn_id: number;
  loading_state: any;
  on_load: () => void;
}) {
  const [loading_state, set_loading_state] = useState(LoadingState.PROCESSING);
  const loaded_elements = useRef(0);

  const [hnCommentData, error] = useItem(props.hn_id);

  let hn_comment = new CommentItem({});
  if (hnCommentData) {
    hn_comment = new CommentItem(hnCommentData);
    if (!hnCommentData.kids) props.on_load();
  }

  useEffect(() => {
    if (loading_state == LoadingState.COMPLETE) props.on_load();
  });

  function on_load() {
    ++loaded_elements.current;
    const state =
      loaded_elements.current > hn_comment.kids.length - 2
        ? LoadingState.COMPLETE
        : LoadingState.PROCESSING;
    if (loading_state != state) set_loading_state(state);
  }

  function create_comment() {
    let child_comments, comment_text, comment_meta;

    if (hn_comment.is_valid) {
      comment_meta = (
        <summary className="ml-2 mt-2 mt-m-3 f6 pa1 align-items-baseline text-orange-600">
          <span className="ml-2">{hn_comment.by}</span>
          <span className="ml-1">{hn_comment.time}</span>
        </summary>
      );
      comment_text = (
        <p className="near-black mx-3 mv-1 pb-2 text-orange-800">
          <span
            className="w-100"
            dangerouslySetInnerHTML={{ __html: hn_comment.text }}
          ></span>
        </p>
      );
      child_comments =
        hn_comment.kids && hn_comment.kids.length
          ? hn_comment.kids.map((id, index) => (
              <div className="ml-1">
                <Comment
                  key={index}
                  loading_state={loading_state}
                  on_load={on_load}
                  hn_id={id as number}
                ></Comment>
              </div>
            ))
          : null;
    }

    return [child_comments, comment_text, comment_meta];
  }

  const [child_comments, comment_text, comment_meta] = [...create_comment()];

  return (
    <details
      id="icon"
      className="rounded mw-100 shadow-lr b--black-20 bg-orange-200"
      open
      hidden={
        props.loading_state == LoadingState.PROCESSING || !hn_comment.is_valid
          ? true
          : false
      }
    >
      {comment_meta}
      {comment_text}
      {child_comments}
    </details>
  );
}

const Comments: React.FC = (props: any) => {
  const temp: StoryItem = {
    id: 0,
    url: "",
    descendants: 0,
    score: 0,
    type: "",
    by: "",
    time: 0,
    kids: [],
    title: "",
  };
  const hn_id = props.match.params.id;

  const headline: StoryItem = useHeadline({ hn_id: hn_id });
  const [loading_state, set_loading_state]: [LoadingState, any] = useState(
    LoadingState.PROCESSING
  ); //true means processing, false means done.
  const loaded_elements = useRef(0);

  function on_load() {
    ++loaded_elements.current;
    let state;
    state =
      loaded_elements.current > headline.kids!.length - 2
        ? LoadingState.COMPLETE
        : LoadingState.PROCESSING;
    if (state != loading_state) {
      set_loading_state(state);
      window.scrollTo(0, 0);
    }
  }

  const [load_state, setLoading] = useState(LoadState.InProcess);

  const on_complete = () => {
    setLoading(LoadState.Complete);
  };

  const story_meta =
    headline && headline.by ? (
      <HNStoryCard
        hn_id={headline.id}
        load_state={load_state}
        on_complete={on_complete}
      ></HNStoryCard>
    ) : undefined;

  let comment, key: number;

  if (headline.kids && headline.kids.length)
    comment = headline.kids.map((id, index) => (
      <Comment
        key={index}
        hn_id={id}
        loading_state={loading_state}
        on_load={on_load}
      ></Comment>
    ));

  return (
    <main className="">
      <div>
        {story_meta}
        <article
          className=""
          hidden={loading_state == LoadingState.PROCESSING ? true : false}
        >
          {comment}
        </article>
        {loading_state == LoadingState.PROCESSING ? <Loading></Loading> : null}
      </div>
    </main>
  );
};

export { Comments };
