import {useEffect, useState} from "react";
import axios, {Canceler} from "axios";

const useAlbumsFetch = (query: string | undefined, offset: number) => {
    const [loading, setLoading] = useState(true)
    const [albums, setAlbums] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setLoading(true)
        let cancel: Canceler
        axios({
            method: 'GET',
            url: `https://api.spotify.com/v1/artists/${query}/albums`,
            params: {q: query, offset: offset},
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            if (res.status !== 200) {
                setAlbums([]);
                setHasMore(false);
                setLoading(false);
            } else {
                //@ts-ignore
                setAlbums(prevArtists => {
                    // @ts-ignore
                    return [...new Set([...prevArtists, ...res.data.items])]
                })
                setHasMore(res.data.total >= res.data.limit)
                setLoading(false)
            }
        }).catch(e => {
            if (axios.isCancel(e)) return
        })
        return () => cancel()
    }, [query, offset])

    return {loading, albums, hasMore}
}
export default useAlbumsFetch
