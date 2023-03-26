import React, {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import useArtistsSearch from "../hooks/useArtistsSearch";
import {Link, useNavigate} from "react-router-dom";
import Artist from "../interfaces/artist";

const App = () => {

    const [query, setQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const navigate = useNavigate();

    const {
        artists,
        hasMore,
        loading,
    } = useArtistsSearch(query, offset);

    useEffect(() => {
        if (window.localStorage.getItem('token') === null) {
            navigate('/login');
        }
        if (window.localStorage.getItem('query') !== undefined) {
            // @ts-ignore
            setQuery(window.localStorage.getItem('query'));
        }
        window.addEventListener('beforeunload', (e) => {
            window.localStorage.removeItem('query');
        })
    }, [])

    const observer = useRef()
    const lastArtistElementRef = useCallback((node: any) => {
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
            <div className="flex content-center justify-center">
                <div className="relative rounded-md shadow-sm w-[50%]">
                    <input
                        type="text"
                        onChange={event => {
                            setOffset(0);
                            setQuery(event.target.value);
                            window.localStorage.setItem('query', event.target.value);
                        }}
                        value={query ?? ''}
                        className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                        placeholder="Search for an artist"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                    </div>
                </div>
            </div>
            <div
                className="mt-6 mx-6 sm:mx-0 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 sm:gap-y-4 lg:grid-cols-4">
                {artists.map((artist: Artist, index: number) => {
                    const rating = Array.from({length: Math.round(artist.popularity / 20)}, (_, i) => <svg
                        aria-hidden="true" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>);
                    return (
                        <div ref={artists.length === index + 1 ? lastArtistElementRef : null} key={artist.id}
                             className="group relative">
                            <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100">
                                <img src={artist.images[0]?.url ? artist.images[0].url : '/noImageAvailable.webp'}
                                     alt={artist.name}
                                     className="object-cover object-center"/>
                                <div className="flex items-end p-4 opacity-0 group-hover:opacity-100"
                                     aria-hidden="true">
                                    <div
                                        className="w-full rounded-md bg-white bg-opacity-75 py-2 px-4 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter">
                                        View Albums
                                    </div>
                                </div>
                            </div>
                            <div
                                className="mt-4 flex items-center justify-between space-x-8 text-base font-medium text-gray-900">
                                <h3>
                                    <Link to={`/${artist.id}/albums`} state={{name: artist.name}}>
                                        <span aria-hidden="true" className="absolute inset-0"/>
                                        {artist.name}
                                    </Link>
                                </h3>
                                <p>{artist.followers.total} Followers</p>
                            </div>
                            <p className="mt-1 flex items-center mb-5">{rating}</p>
                        </div>
                    )
                })}
            </div>
        </>
    );
}

export default App;
