export interface Playlist {
    id: string;
    name: string;
    images: Array<{ url: string }>;
}

export interface Track {
    name: string;
    artists: Array<{ name: string }>;
    album: { name: string; images: Array<{ url: string }> };
    duration_ms: number;
}

export interface PlaylistTrack {
    track: Track;
}

interface PlaylistState {
    playlists: Array<Playlist>;
    selectedPlaylist: string | null;
    tracks: Array<PlaylistTrack>;
    loading: boolean;
}
