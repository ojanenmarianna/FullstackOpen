import { useState, useEffect } from 'react'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) return

    const fetchCountry = async () => {
      try {
        const response = await fetch(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        if (!response.ok) throw new Error('Country not found')
        const data = await response.json()
        setCountry({ found: true, data })
      } catch (err) {
        setCountry({ found: false })
      }
    }

    fetchCountry()
  }, [name])

  return country
}
