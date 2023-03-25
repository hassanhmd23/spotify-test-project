import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import NotFound from "./pages/notFound";
import Layout from "./components/layout";
import Login from "./pages/login";
import axios from "axios";
import Albums from "./pages/albums";
import SessionEnded from "./pages/sessionEnded";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }
);

axios.interceptors.response.use(undefined,
    error => {
        if (error.response.status === 401) {
            localStorage.clear();
            router.navigate('/session-ended')
        } else {
            return error;
        }
    }
)

const router = createBrowserRouter([
    {
        element: <Layout/>,
        errorElement: <NotFound/>,
        children: [
            {
                path: "/",
                element: <App/>
            },
            {
                path: "/:artist/albums",
                element: <Albums/>,
            }
        ]
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/session-ended',
        element: <SessionEnded/>
    }
])

root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
