import { useState, useEffect } from 'react'

import './index.css'
import Filter from './components/filter'
import NewPersonForm from './components/newPersonForm'
import PersonsToShow from './components/showPersons'
import Notification from './components/notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  const addPerson = (event) => {
    event.preventDefault()
    
    const exists = persons.filter((person) => person.name === newName)

    if (exists.length > 0) {
      if (
        window.confirm(`${newName} is already added to the phonebook, do you want to replace the old number?`)
    ) {
        const personObject = {
          name: exists[0].name,
          number: newNumber,
          id: exists[0].id,
        }
        personService.update(personObject.id, personObject)
        .then((returnedPerson) => {
          setPersons(persons.map((person) =>
              person.id !== personObject.id ? person : returnedPerson
            )
          )
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`${newName}'s number was updated succesfully`)
          setTimeout(() => setSuccessMessage(null), 4000)
        })
        .catch((error) => {
          setErrorMessage(`Information of ${newName} was already removed from server`)
          setTimeout(() => setErrorMessage(null), 4000);
        })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson))
          setNewNumber('')
          setNewName('')
          setSuccessMessage(`Person ${newName} was added succesfully`);
          setTimeout(() => setSuccessMessage(null), 4000);
        })
        .catch(error => {
          setErrorMessage(`Name ${newName} is shorter than the mimum allowed length (3)`)
          setTimeout(() => setErrorMessage(null), 4000);
        })
    }
  }

  const removePerson = (id) => {
    const personToRemove = persons.filter((p) => p.id === id)[0];
    if (window.confirm(`Delete ${personToRemove.name}?`)) {
      personService
        .remove(id)
        .then((response) => {
          setPersons(persons.filter((p) => p.id !== id));
          setSuccessMessage(`Removed ${personToRemove.name}`);
          setTimeout(() => setSuccessMessage(null), 4000);
        })
        .catch((error) => {
          setErrorMessage(
            `Person ${personToRemove.name} was already removed from server`
          );
          setTimeout(() => setErrorMessage(null), 4000);
        });
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />
      <Filter new Filter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <NewPersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <PersonsToShow personsToShow={personsToShow} remove={removePerson} />
    </div>
  )
}

export default App