import { useEffect, useRef } from 'react'

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// Slightly modified to allow the interval to be stopped.
const useInterval = (callback, delay) => {
  const savedCallback = useRef()
  let id

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])

  return [
    id,
    () => {
      clearInterval(id)
      id = undefined
    }
  ]
}

export default useInterval
