import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryDetails = ({ country }) => (
  <div>
    <h1>{country.name.common}</h1>
    <p>Capital {country.capital}</p>
    <p>Area {country.area}</p>

    <h3>Languages</h3>
    <ul>
      {Object.values(country.languages).map(lang =>
        <li key={lang}>{lang}</li>
      )}
    </ul>

    <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
  </div>
)


const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  const filtered = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      <Results countries={filtered} selected={selectedCountry} onShow={handleShowCountry} />
    </div>
  )
}

const Results = ({ countries, selected, onShow }) => {
  if (selected) {
    return <CountryDetails country={selected} />
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.cca3}>
            {country.name.common}
            <button onClick={() => onShow(country)}>Show</button>
          </li>
        ))}
      </ul>
    )
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }

  return <p>No matches</p>
}

export default App
