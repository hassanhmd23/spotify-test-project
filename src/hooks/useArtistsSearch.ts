import {useEffect, useState} from 'react'
import axios, {Canceler} from 'axios'

const useArtistsSearch = (query: string | undefined, offset: number) => {
    const [loading, setLoading] = useState(true)
    const [artists, setArtists] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        setArtists([])
    }, [query])

    useEffect(() => {
        setLoading(true)
        let cancel: Canceler
        axios({
            method: 'GET',
            url: 'https://api.spotify.com/v1/search',
            params: {q: query, offset: offset, type: 'artist'},
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            if (res.status !== 200) {
                setArtists([]);
                setHasMore(false);
                setLoading(false);
            } else {
                //@ts-ignore
                setArtists(prevArtists => {
                    // @ts-ignore
                    return [...new Set([...prevArtists, ...res.data.artists.items])]
                })
                setHasMore(res.data.artists.total >= res.data.artists.limit)
                setLoading(false)
            }
        }).catch(e => {
            if (axios.isCancel(e)) return
        })
        return () => cancel()
    }, [query, offset])

    return {loading, artists, hasMore}
}
export default useArtistsSearch
