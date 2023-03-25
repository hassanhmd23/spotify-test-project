interface Album {

    id: string,
    name: string,
    artists: [{
        name: string,
    }],
    external_urls: {
        spotify: string
    },
    release_date: string,
    total_tracks: number,
    images: [{
        url: string
    }],
}

export default Album
