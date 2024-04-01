export interface SerijeTmdbI {
    results: Array<SerijaTmdbI>;
    current_page: number;
    total_pages: number;
}

export interface SerijaTmdbI {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
}

export interface SezonaTmdb{
    id: number;
    name: string;
    overview: string;
    season_number: number;
    episode_count: number;
    poster_path: string | null;

    air_date: string;
    vote_average: number;
}

export interface SerijaTmdbDetaljiI {
    id: number;
    name: string;
    overview: string;
    number_of_episodes: number;
    number_of_seasons: number;
    popularity: number;
    poster_path: string | null;
    homepage: string;
    seasons: Array<SezonaTmdb>;

    first_air_date: string | null;
    last_air_date: string | null;
    original_language: string;
    original_name: string;
    vote_average: number;
    vote_count: number;
}