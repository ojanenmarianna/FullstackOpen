import Person from "./person"

const PersonsToShow = ({ personsToShow, remove }) => {
    return (
      <div>
        {personsToShow.map((person) => (
          <Person
            key={person.id}
            name={person.name}
            number={person.number}
            id={person.id}
            handleRemove={remove}
          />
        ))}
      </div>
    )
  }

export default PersonsToShow