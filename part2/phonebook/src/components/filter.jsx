const Filter = (props) => {
  return (
    <div>
      filter by name:{" "}
      <input value={props.newFilter} onChange={props.handleFilterChange} />
    </div>
  )
}

export default Filter