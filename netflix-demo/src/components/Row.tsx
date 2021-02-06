import * as React from "react";
import YouTube from "react-youtube";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import "./Row.scss";

const base_url = "https://image.tmdb.org/t/p/original";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

type Props = {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
};

type Movie = {
  id: string;
  name: string;
  title: string;
  original_name: string;
  poster_path: string;
  backdrop_path: string;
};

//trailerのoption
type Options = {
  height: string;
  width: string;
  playerVars: {
    autoplay: 0 | 1 | undefined;
  };
};

export const Row = ({ title, fetchUrl, isLargeRow }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>("");

  //urlが更新される度に
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts: Options = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleClick = async (movie: Movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      let trailerurl = await axios.get(
        `/movie/${movie.id}/videos?api_key=${API_KEY}`
      );
      setTrailerUrl(trailerurl.data.results[0]?.key);
    }
  };

  return (
    <div className="Row">
      <h2>{title}</h2>
      <div className="Row-posters">
        {movies.map((movie) => {
          function isAlphabet(str: string) {
            return str.match(/[^a-z]-[A-Z]/) ? false : true;
          }
          const slicedName = isAlphabet(movie.original_name)
            ? movie.original_name.length > 20
              ? movie.original_name.slice(0, 20) + "…"
              : movie.original_name
            : movie.original_name.length > 11
            ? movie.original_name.slice(0, 11) + "…"
            : movie.original_name;

          console.log("test", isAlphabet("WandaVision"));
          return (
            <div className="Row-poster-wrap">
              <img
                key={movie.id}
                className={`Row-poster ${isLargeRow && "Row-poster-large"}`}
                src={`${base_url}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name}
                onClick={() => handleClick(movie)}
              />
              <p>{slicedName}</p>
            </div>
          );
        })}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};
