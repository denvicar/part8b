import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, UPDATE_BIRTHYEAR } from '../queries'
import Select from 'react-select'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [ year, setYear ] = useState('')
  const authors = useQuery(ALL_AUTHORS)
  const [ updateYear ] = useMutation(UPDATE_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })
  if (!props.show || authors.loading) {
    return null
  }

  const options = authors.loading ? [] :
  authors.data.allAuthors.map(a => {return {value: a.name, label: a.name}})

  const submit = async (event) => {
    event.preventDefault()

    await updateYear({
      variables: {name:name.value, year: Number(year)}
    })

    setName('')
    setYear('')
  }
  

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          <Select
            options={options}
            onChange={setName}
            defaultValue={name}
          />
        </div>
        <div>
          birthyear
          <input type="number" value={year} onChange={({target}) => setYear(target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
