import React, { useEffect, useState, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { TaskContext } from '../context/TaskContext'
import PageShell from './layout/PageShell'
import Container from './ui/Container'
import Card from './ui/Card'
import Heading from './ui/Heading'
import Input from './ui/Input'
import Button from './ui/Button'
import Spinner from './ui/Spinner'
import Avatar from './ui/Avatar'
import Modal from './ui/Modal'
import Toast from './ui/Toast'

const priorityRanks = { High: 3, Medium: 2, Low: 1 }

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const {
    tasks,
    loading,
    error,
    metrics,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
  } = useContext(TaskContext)

  // Filter and Search States
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('position')

  // Toast State
  const [toast, setToast] = useState(null)

  // Add Modal State
  const [addOpen, setAddOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newPriority, setNewPriority] = useState('Medium')
  const [creating, setCreating] = useState(false)

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const [editPriority, setEditPriority] = useState('Medium')
  const [editStatus, setEditStatus] = useState('Pending')
  const [updating, setUpdating] = useState(false)

  // Drag and Drop State
  const [draggedIdx, setDraggedIdx] = useState(null)

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Derive filtered and sorted tasks list
  const filteredTasks = useMemo(() => {
    let list = tasks || []

    // 1. Filter by Status Tab
    if (activeTab !== 'All') {
      list = list.filter((t) => t.status === activeTab)
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      )
    }

    // 3. Sort
    return [...list].sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      if (sortBy === 'priority') {
        return (priorityRanks[b.priority] || 2) - (priorityRanks[a.priority] || 2)
      }
      // default: position
      return (a.position || 0) - (b.position || 0)
    })
  }, [tasks, activeTab, searchQuery, sortBy])

  // Handle Task Creation
  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    setCreating(true)
    try {
      await createTask({
        title: newTitle,
        description: newDescription,
        dueDate: newDueDate || null,
        priority: newPriority,
        status: 'Pending',
      })
      setToast({ message: 'Task created successfully', type: 'success' })
      setAddOpen(false)
      // Reset fields
      setNewTitle('')
      setNewDescription('')
      setNewDueDate('')
      setNewPriority('Medium')
    } catch (err) {
      setToast({ message: err.message || 'Failed to create task', type: 'error' })
    } finally {
      setCreating(false)
    }
  }

  // Handle Modal Edit Open
  const openEditModal = (task) => {
    setSelectedTask(task)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')
    setEditPriority(task.priority)
    setEditStatus(task.status)
    setEditOpen(true)
  }

  // Handle Task Update
  const handleUpdateTask = async (e) => {
    e.preventDefault()
    if (!editTitle.trim()) return

    setUpdating(true)
    try {
      await updateTask(selectedTask._id, {
        title: editTitle,
        description: editDescription,
        dueDate: editDueDate || null,
        priority: editPriority,
        status: editStatus,
      })
      setToast({ message: 'Task updated successfully', type: 'success' })
      setEditOpen(false)
    } catch (err) {
      setToast({ message: err.message || 'Failed to update task', type: 'error' })
    } finally {
      setUpdating(false)
    }
  }

  // Handle Status Quick Toggle
  const handleToggleStatus = async (task) => {
    const nextStatusMap = {
      'Pending': 'In-Progress',
      'In-Progress': 'Completed',
      'Completed': 'Pending',
    }
    const nextStatus = nextStatusMap[task.status] || 'Pending'

    try {
      await updateTask(task._id, { status: nextStatus })
      setToast({ message: `Status updated to ${nextStatus}`, type: 'success' })
    } catch (err) {
      setToast({ message: 'Failed to toggle status', type: 'error' })
    }
  }

  // Handle Task Deletion
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      await deleteTask(taskId)
      setToast({ message: 'Task deleted successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete task', type: 'error' })
    }
  }

  // Drag-and-drop Handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index)
    setDraggedIdx(index)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = async (e, toIndex) => {
    e.preventDefault()
    const fromIndex = draggedIdx
    if (fromIndex === null || fromIndex === toIndex) return

    const fromTask = filteredTasks[fromIndex]
    const toTask = filteredTasks[toIndex]

    const actualFromIdx = tasks.findIndex((t) => t._id === fromTask._id)
    const actualToIdx = tasks.findIndex((t) => t._id === toTask._id)

    if (actualFromIdx !== -1 && actualToIdx !== -1) {
      const updatedTasks = [...tasks]
      const [removed] = updatedTasks.splice(actualFromIdx, 1)
      updatedTasks.splice(actualToIdx, 0, removed)

      const ids = updatedTasks.map((t) => t._id)
      await reorderTasks(ids)
    }
    setDraggedIdx(null)
  }

  // Render Priority Color Codes
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'border-rose-500/20 bg-rose-500/10 text-rose-300'
      case 'Medium':
        return 'border-amber-500/20 bg-amber-500/10 text-amber-300'
      default:
        return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
    }
  }

  // Render Status Badge
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
      case 'In-Progress':
        return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
      default:
        return 'bg-white/5 text-white/60 border border-white/10'
    }
  }

  return (
    <PageShell>
      <Container className="py-8">
        {/* Profile Card Summary */}
        {user && (
          <Card className="mb-8 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar name={user.UserName} size={54} />
                <div>
                  <Heading className="text-xl text-white">{user.UserName}</Heading>
                  <p className="text-sm text-white/50">{user.gmail}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-white/40 block">Member Since</span>
                <span className="text-sm font-semibold text-white/80">
                  {new Date(user.timestamp || user.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Metrics Grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Total Tasks', count: metrics.total, color: 'text-white' },
            { label: 'Pending', count: metrics.pending, color: 'text-amber-300' },
            { label: 'In Progress', count: metrics.inProgress, color: 'text-cyan-300' },
            { label: 'Completed', count: metrics.completed, color: 'text-emerald-300' },
          ].map((m) => (
            <Card key={m.label} className="p-5 transition hover:scale-[1.02]">
              <div className="text-xs font-bold text-white/55 tracking-wider uppercase">{m.label}</div>
              <div className={`mt-2 text-3xl font-extrabold ${m.color}`}>{m.count}</div>
            </Card>
          ))}
        </div>

        {/* Filter, Search & Action Bar */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search and Tabs */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/15 bg-white/5 pl-4 pr-10 text-white placeholder:text-white/45 outline-none transition focus:border-white/30 focus:bg-white/8 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
              {['All', 'Pending', 'In-Progress', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === tab
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting and Add Task Button */}
          <div className="flex items-center gap-3 justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-white/50">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 rounded-xl border border-white/15 bg-slate-900 px-3 text-sm text-white/90 outline-none transition focus:border-white/30"
              >
                <option value="position">Default Order</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <Button onClick={() => setAddOpen(true)} variant="secondary" className="h-11">
              + Add Task
            </Button>
          </div>
        </div>

        {/* Task Cards List */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card className="flex min-h-[250px] flex-col items-center justify-center p-6 text-center border-dashed">
            <div className="text-3xl">📝</div>
            <Heading className="mt-3 text-lg text-white">No tasks found</Heading>
            <p className="mt-1 text-sm text-white/50 max-w-xs">
              {searchQuery || activeTab !== 'All'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by creating your very first task above!'}
            </p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filteredTasks.map((task, index) => (
              <div
                key={task._id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`transition ${draggedIdx === index ? 'opacity-40 scale-[0.98]' : ''}`}
              >
                <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between cursor-grab active:cursor-grabbing hover:bg-white/8 hover:border-white/15 transition-all">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Status Check Circle */}
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/60 hover:bg-white/10 hover:border-white/40 transition cursor-pointer"
                      title="Click to toggle status"
                    >
                      {task.status === 'Completed' ? '✓' : task.status === 'In-Progress' ? '➜' : '○'}
                    </button>

                    <div className="space-y-1">
                      <Heading
                        className={`text-base text-white ${
                          task.status === 'Completed' ? 'line-through text-white/40' : ''
                        }`}
                      >
                        {task.title}
                      </Heading>
                      {task.description && (
                        <p className="text-sm text-white/60 line-clamp-2 max-w-2xl leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Info Badges */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`rounded-lg border px-2 py-0.5 text-xs font-semibold ${getPriorityStyle(task.priority)}`}>
                          {task.priority} Priority
                        </span>
                        
                        <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${getStatusBadgeStyle(task.status)}`}>
                          {task.status}
                        </span>

                        {task.dueDate && (
                          <span className="inline-flex items-center gap-1 text-xs text-white/50 bg-white/5 rounded-lg px-2 py-0.5">
                            📅 {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-3 sm:border-none sm:pt-0">
                    <Button onClick={() => openEditModal(task)} size="sm" variant="primary">
                      Edit
                    </Button>
                    <Button onClick={() => handleDeleteTask(task._id)} size="sm" variant="danger">
                      Delete
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* Add Task Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="grid gap-4">
          <Input
            label="Task Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Review code assignment"
            required
          />

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-white/90">Description</label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="min-h-[100px] w-full resize-y rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-white/30"
              placeholder="Provide context or instructions..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-white/90">Due Date</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="h-11 rounded-xl border border-white/15 bg-slate-900 px-3 text-sm text-white/90 outline-none transition focus:border-white/30"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-white/90">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="h-11 rounded-xl border border-white/15 bg-slate-900 px-3 text-sm text-white/90 outline-none transition focus:border-white/30"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="primary" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary" disabled={creating}>
              {creating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Task">
        {selectedTask && (
          <form onSubmit={handleUpdateTask} className="grid gap-4">
            <Input
              label="Task Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-white/90">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="min-h-[100px] w-full resize-y rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-white/30"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2 col-span-1">
                <label className="text-sm font-semibold text-white/90">Due Date</label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="h-11 rounded-xl border border-white/15 bg-slate-900 px-2 text-xs text-white/90 outline-none transition focus:border-white/30"
                />
              </div>

              <div className="grid gap-2 col-span-1">
                <label className="text-sm font-semibold text-white/90">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="h-11 rounded-xl border border-white/15 bg-slate-900 px-2 text-sm text-white/90 outline-none transition focus:border-white/30"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="grid gap-2 col-span-1">
                <label className="text-sm font-semibold text-white/90">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="h-11 rounded-xl border border-white/15 bg-slate-900 px-2 text-sm text-white/90 outline-none transition focus:border-white/30"
                >
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <Button type="button" variant="primary" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={updating}>
                {updating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </PageShell>
  )
}
