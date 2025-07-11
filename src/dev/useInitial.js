import {useState} from 'react';

export const useInitial = () => {
    const [status, setStatus] = useState({
        loading: false,
        error: null
    });
    
    /*
     * Example of how to use the hook:
     * const story = () => {
     *   useEffect(() => {
     *     setStatus({loading: true, error: null});
     *     fetch(url)
     *       .then(response => response.json())
     *       .then(data => {
     *         setStatus({loading: false, error: null});
     *       })
     *       .catch(error => {
     *         setStatus({loading: false, error});
     *       });
     *   }, []);
     * }
     */

    return {
        status
    };
};