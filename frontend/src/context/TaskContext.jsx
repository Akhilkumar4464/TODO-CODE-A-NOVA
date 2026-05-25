import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'

export const TaskContext = createContext(null)

export default function TaskProvider({ children }) {
  const { token } = useContext(AuthContext)

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const apiBase = import.meta.env.VITE_API_URL

  const request = useCallback(
    async (path, { method = 'GET', body } = {}) => {
      const res = await fetch(`${apiBase}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Request failed')
      return data
    },
    [apiBase, token]
  )

  const fetchTasks = async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const data = await request('/tasks')
      // backend currently doesn't implement /tasks yet; keep robust shape
      setTasks(Array.isArray(data) ? data : data?.tasks || [])
    } catch (e) {
      setError(e.message)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  // Optimistic helpers (will work once /api/tasks exists)
  const createTask = async (payload) => {
    const data = await request('/tasks', { method: 'POST', body: payload })
    await fetchTasks()
    return data
  }

  const updateTask = async (id, payload) => {
    const data = await request(`/tasks/${id}`, { method: 'PUT', body: payload })
    await fetchTasks()
    return data
  }

  const deleteTask = async (id) => {
    await request(`/tasks/${id}`, { method: 'DELETE' })
    await fetchTasks()
  }

  const metrics = useMemo(() => {
    const map = {
      total: tasks.length,
      completed: 0,
      pending: 0,
      inProgress: 0,
    }
    for (const t of tasks) {
      if (t.status === 'Completed') map.completed++
      else if (t.status === 'In-Progress') map.inProgress++
      else map.pending++
    }
    return map
  }, [tasks])

  const value = useMemo(
    () => ({
      tasks,
      loading,
      error,
      metrics,
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
    }),
    [tasks, loading, error, metrics]
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

