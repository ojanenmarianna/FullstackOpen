const Country = ({ country }) => {
    const capitals = country.capital
    const languages = Object.values(country.languages)
    const imagesrc = country.flags.png
  
    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>
          <b>capital:</b> {capitals.join(", ")}
          <br />
          <b>population:</b> {country.population}
          <br />
          <b>area:</b> {country.area}
          <h2>languages</h2>
          <ul>
            {languages.map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img src={imagesrc} alt="flag" width="150px" height="auto"></img>
        </div>
      </div>
    )
  }
  
  export default Country