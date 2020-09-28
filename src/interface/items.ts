import React, { useEffect, useRef, useState } from "react";
import { string } from "prop-types";
import { CANCELLED } from "dns";

export interface StoryItem {
  id: Number;
  type: string;
  url: string;
  title: string;
  text?: string;
  by: string;
  time: number;
  kids?: Array<number>;
  descendants: number;
  score: number;
}

export interface CommentItemInterface {
  id: number;
  by: string;
  parent?: number;
  is_valid: boolean;
  kids: Array<number>;
  text: string;
  time: string;
}

export class CommentItem implements CommentItemInterface {
  private deleted?: boolean;
  private dead?: boolean;
  private type?: string;
  private _id?: number;
  private _by?: string;
  private _time: any;
  private _kids?: Array<number>;
  private _text?: string;

  readonly parent?: number;

  constructor(hn_item: any) {
    this.deleted = hn_item.deleted;
    this.dead = hn_item.dead;
    this.type = hn_item.type;
    this._id = hn_item.id;
    this._by = hn_item.by;
    this._time = hn_item.time;
    this._kids = hn_item.kids;
    this._text = hn_item.text;
  }

  get is_valid() {
    if (
      this.deleted == undefined &&
      this.dead == undefined &&
      this.type === "comment" &&
      this._text &&
      this._id
    )
      return true;
    else return false;
  }

  get text() {
    if (this.is_valid) return this._text!;
    else return "";
  }

  get kids() {
    if (this._kids) return this._kids;
    else return [];
  }

  get id() {
    if (this._id) return this._id;
    else throw "Error: Cannot find comment id";
  }

  get by() {
    if (this._by) return this._by;
    else throw "Error: Cannot find comment author";
  }

  get time() {
    enum Calendar {
      Year = 60 * 24 * 30 * 12,
      Month = 60 * 24 * 30,
      Day = 60 * 24,
      Hour = 60,
      Minute = 1,
    }
    if (this._time) {
      //this._time display time since epoch in seconds
      // Date expect input in milliseconds
      const date = new Date();
      let delta_time = (date.getTime() / 1000 - this._time) / 60;
      switch (true) {
        case delta_time > Calendar.Year:
          return ` ${Math.floor(delta_time / Calendar.Year)} years ago`;

        case delta_time > Calendar.Month:
          return ` ${Math.floor(delta_time / Calendar.Month)} month ago`;

        case delta_time > Calendar.Day:
          return ` ${Math.floor(delta_time / Calendar.Day)} days ago`;

        case delta_time > Calendar.Hour:
          return ` ${Math.floor(delta_time / Calendar.Hour)} hours ago`;

        case delta_time >= Calendar.Minute:
          return ` ${Math.floor(delta_time / Calendar.Minute)} minutes ago`;

        default:
          return "";
      }
    } else return "";
  }
}

export enum ComponentState {
  UPDATED,
  UNMOUNTED,
}

export function useHeadline(props: {
  hn_id: number;
  component_state?: () => void;
}): StoryItem {
  let init: StoryItem = {
    title: "",
    url: "",
    by: "",
    score: 0,
    descendants: 0,
    id: 0,
    time: 0,
    type: "",
    kids: [],
  };

  const [headline, set_headine]: [StoryItem, any] = useState(init);
  let is_mounted = useRef(true);

  useEffect(() => {
    let request = new Request(
      `https://hacker-news.firebaseio.com/v0/item/${props.hn_id}.json`,
      {
        method: "GET",
        cache: "default",
      }
    );
    fetch(request).then((response) => {
      if (is_mounted.current && response.ok) {
        if (props.component_state != undefined) {
          props.component_state();
        }
        response.json().then((data) => {
          set_headine(data);
        });
      }
    });

    return () => {
      is_mounted.current = false;
    };
  }, [props.hn_id]);

  return headline;
}

export const StoriesType: { [key: string]: string } = {
  news: "topstories",
  new: "newstories",
  top: "topstories",
  best: "beststories",
  ask: "askstories",
  show: "showstories",
  job: "jobstories",
};
