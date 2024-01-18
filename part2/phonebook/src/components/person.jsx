const Person = ({ name, number, id, handleRemove }) => {
    return (
      <div>
      <b>{name}</b> {number}{" "}
      <button onClick={() => handleRemove(id)}>delete</button>
    </div>
    )
  }

export default Person