interface Artist {
    id: string,
    name: string,
    followers: {
        total: number,
    },
    images: [{
        url: string
    }],
    popularity: number,
}
export default Artist
