export interface ExternalUrls {
    spotify: string;
}

export interface ArtistObject {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface ImageObject {
    url: string;
    height: number;
    width: number;
}

export interface AlbumObject {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions?: any;
    type: string;
    uri: string;
    artists: ArtistObject[];
}

export interface TrackObject {
    album: AlbumObject;
    artists: ArtistObject[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: Record<string, string>;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    linked_from?: any;
    restrictions?: any;
    name: string;
    popularity: number;
    preview_url: string | null;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
}

export interface Playlist {
    id: string;
    name: string;
    images: Array<{ url: string }>;
}

export interface PlaylistTrack {
    track: TrackObject;
}