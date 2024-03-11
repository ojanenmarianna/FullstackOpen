import { useState, useEffect } from 'react'
import axios from 'axios'
import ShowCountries from './components/showCountries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const filteredCountries = countries.filter((country) => {
    return country.name.common.toLowerCase().includes(newFilter.toLowerCase())
  })

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    })
  }, [])

  const handleNewFilter = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      find countries: <input value={newFilter} onChange={handleNewFilter} />
      <ShowCountries
        countries={filteredCountries}
        filter={newFilter}
        setNewFilter={setNewFilter}
      />
    </div>
  )
}

export default App