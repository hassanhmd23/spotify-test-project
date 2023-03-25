import {useLocation, useParams} from "react-router-dom";
import React, {useCallback, useRef, useState} from "react";
import useAlbumsFetch from "../hooks/useAlbumsFetch";
import Album from "../interfaces/album";

const Albums = () => {

    const [offset, setOffset] = useState(0);
    const params = useParams();
    let {state} = useLocation();
    console.log(state.name);
    const {
        albums,
        hasMore,
        loading,
    } = useAlbumsFetch(params.artist, offset);

    const observer = useRef()
    const lastAlbumElementRef = useCallback((node: any) => {
        if (loading) return
        // @ts-ignore
        if (observer.current) observer.current.disconnect()
        // @ts-ignore
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setOffset(prevOffset => prevOffset + 20)
            }
        })
        if (node) {
            // @ts-ignore
            observer.current.observe(node)
        }
    }, [loading, hasMore])

    return (
        <>
            <div className="flex flex-col items-start">
                <h2 className="text-3xl font-bold text-gray-900">{state.name}</h2>
                <h4 className="text-gray-400">Albums</h4>
            </div>
            <div
                className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
                {albums.map((album: Album, index: number) => {
                    const artistsNames = album.artists.map(artist => artist.name).join(", ")
                    return (
                        <div ref={albums.length === index + 1 ? lastAlbumElementRef : null} key={album.id}
                             className="group relative">
                            <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100">
                                <img src={album.images[0]?.url ? album.images[0].url : '/noImageAvailable.webp'}
                                     alt={album.name}
                                     className="object-cover object-center"/>
                                <div className="flex items-end p-4 opacity-0 group-hover:opacity-100"
                                     aria-hidden="true">
                                    <div
                                        className="w-full rounded-md bg-white bg-opacity-75 py-2 px-4 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter">
                                        Preview on Spotify
                                    </div>
                                </div>
                            </div>
                            <div
                                className="mt-4 flex items-center justify-between space-x-8 text-base font-medium text-gray-900">
                                <h3>
                                    <a href={album.external_urls.spotify} target="_blank">
                                        <span aria-hidden="true" className="absolute inset-0"/>
                                        {album.name}
                                    </a>
                                </h3>
                                <p>{album.total_tracks} Tracks</p>
                            </div>
                            <div
                                className="mt-1 text-sm text-gray-500 flex items-center justify-between space-x-8">
                                <p>{artistsNames}</p>
                                <p>{album.release_date}</p>
                            </div>

                        </div>
                    )
                })}
            </div>
        </>
    );
}

export default Albums;
