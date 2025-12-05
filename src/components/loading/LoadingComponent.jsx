import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import "./loading.css";

const LoadingComponent = () => {
    const auth = useSelector(state => state.auth);
    
    return (
        <div className='loading'>
            {
                auth.loading ? <h1>Loading...</h1> : ""
            }
        </div>
    )
}

export default LoadingComponent