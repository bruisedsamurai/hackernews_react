import useSWR from "swr";

//@ts-ignore
const fetcher = (...args: any) => fetch(...args).then((res) => res.json());

export const useItem = (hnItemId: Number) => {
  const { data, error } = useSWR(
    `https://hacker-news.firebaseio.com/v0/item/${hnItemId}.json`,
    fetcher
  );

  return [data, error];
};

export const useStories = (hnStoryType: string) => {
  const { data, error } = useSWR(
    `https://hacker-news.firebaseio.com/v0/${hnStoryType}.json`,
    fetcher
  );

  return [data, error];
};
