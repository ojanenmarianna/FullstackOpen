import Country from "./country"
import Weather from "./weather"

const ShowCountries = ({ countries, filter, setNewFilter }) => {
  const handleClick = (countryName) => {
    setNewFilter(countryName);
  };

  if (filter === "") {
    return null
  } else {
    if (countries.length > 10) {
      return <div>Too many matches</div>
    }
    if (countries.length === 1) {
      return (
        <div>
          <Country country={countries[0]} />
          <Weather
            capital={countries[0].capital[0]}
            country={countries[0].cca2}
          />
        </div>
      );
    }
    if (countries.length < 10) {
      return (
        <div>
          {countries.map((country) => (
            <p key={country.name.common}>
              {country.name.common}{" "}
              <button onClick={() => handleClick(country.name.common)}>
                show
              </button>
            </p>
          ))}
        </div>
      )
    }
  }
}

export default ShowCountries