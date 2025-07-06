import { useState, useEffect } from 'react'
import axios from 'axios'

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  // fetch all resources on mount or when baseUrl changes
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(baseUrl)
        setResources(response.data)
      } catch (error) {
        console.error('Error fetching resources:', error)
      }
    }

    fetchResources()
  }, [baseUrl])

  const create = async (resource) => {
    try {
      const response = await axios.post(baseUrl, resource)
      setResources(resources.concat(response.data))
    } catch (error) {
      console.error('Error creating resource:', error)
    }
  }

  const service = {
    create,
  }

  return [resources, service]
}
