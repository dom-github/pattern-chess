import { useEffect, useReducer, useRef } from "react";

    //~~~"Stop trying to make fetch happen"~~~


// the useFetch hook uses a UseEffect + reducer
// in your React component, call {state} = useFetch('/api-url')
// the {state} will contain a Status (loading/done/error) and the Data that was fetched
// it also stores the output in a cached array, so calling the same api-url
// will not need to send a request to the server, unless the data has changed

// Note that fetch will also return Data, so to access you will need to use state.data.data 
// I recommend using state.status for the Loading/Done/Error check, then assigning a variable:
// {data} = state.data

const useFetch = (url) => {

const initialState = {
    status: 'loading',
    error: null,
    data: [],
};


const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
        case 'FETCHING':
            
            return { ...initialState, status: 'loading' };
        case 'FETCHED':
            
            return { ...initialState, status: 'done', data: action.payload };
        case 'FETCH_ERROR':
            
            return { ...initialState, status: 'error', error: action.payload };
        default:
            return state;
    }
}, initialState);

    
    
    const cache = useRef({});

    useEffect(() => {
        let cancelRequest = false;
        if (!url) return;   //do nothing in case of no url 

        const fetchData = async () => {
            dispatch({ type: 'FETCHING' });
            if (cache.current[url]) {
                
                const data = cache.current[url];
                dispatch({type: 'FETCHED', payload: data})
            } else {
                try {
                    
                const response = await fetch(url);
                const data = await response.json();
                cache.current[url] = data; // sets the data in a cache array using useRef
                dispatch({type: 'FETCHED', payload: data})
                } catch (error) {
                    if (cancelRequest) return;
                    dispatch({type: 'FETCH_ERROR', payload: error.message})
                }
            }
        };
        
        fetchData();

        //cleanup function
        return function cleanup() {
            cancelRequest = true;
        };
    }, [url]);
    
    return {state}
}


export default useFetch;