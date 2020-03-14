import * as React from 'react'
import {useState, useEffect} from 'react'
import LoadingContext from './LoadigContext'
import axios from 'axios'

export const LoadingProvider = (props) => {
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        let isSubscribed = true
        axios.interceptors.request.use((config) => {
            if (isSubscribed) {
                setLoading(true)
            }
            return config
        })
    
        axios.interceptors.response.use((response) => {
            if (isSubscribed) {
                setLoading(false)
            }
            return response
        }, (error) => {
            if (isSubscribed) {
                setLoading(false)
            }
            return Promise.reject(error)
        })
        return () => {
            isSubscribed = false
        }
    }, [])
    

    return (
        <LoadingContext.Provider value={loading}>
            {props.children}
        </LoadingContext.Provider>
    )
}