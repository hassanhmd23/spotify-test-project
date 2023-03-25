import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
    const REDIRECT_URI = "http://localhost:3000/login"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;

    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            // @ts-ignore
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
            navigate('/');
        }

        }, [])

    return (
        <>
            <div className="min-h-full bg-white py-16 px-6 sm:py-24 grid place-items-center lg:px-8">
                <div className="mx-auto max-w-max">
                    <main className="sm:flex">
                        <a
                            href={url}
                            className="rounded-md bg-white py-2.5 px-3.5 text-lg font-semibold inline-flex text-center align-middle text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Login with Spotify
                            <img src="/Spotify_Icon_RGB_Green.png" alt="spotify-icon" className="w-7 h-7 ml-2 -mr-1"/>
                        </a>
                    </main>
                </div>
            </div>
        </>
    )
}
export default Login
