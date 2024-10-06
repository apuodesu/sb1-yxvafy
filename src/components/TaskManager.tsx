import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { toast } from 'react-hot-toast'
import { ListTodo, Check, Circle, LogOut, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Task {
  id: string
  user_id: string
  start_time: string
  end_time: string
  description: string
  completed: boolean
  task_date: string
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [userId, setUserId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else {
        navigate('/login')
      }
    }
    getUserId()
  }, [navigate])

  useEffect(() => {
    if (userId) {
      fetchTasks()
    }
  }, [selectedDate, userId])

  const fetchTasks = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('task_date', selectedDate)
        .order('start_time', { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (error: any) {
      toast.error(`タスクの取得に失敗しました: ${error.message}`)
    }
  }

  const addTask = async () => {
    if (!userId || !newTask || !startTime || !endTime) {
      toast.error('タスク、開始時間、終了時間を入力してください')
      return
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ 
          user_id: userId,
          description: newTask, 
          start_time: startTime, 
          end_time: endTime, 
          completed: false,
          task_date: selectedDate
        }])
        .select()

      if (error) throw error
      setTasks([...tasks, ...(data as Task[])])
      setNewTask('')
      setStartTime('')
      setEndTime('')
      toast.success('タスクが追加されました')
    } catch (error: any) {
      toast.error(`タスクの追加に失敗しました: ${error.message}`)
    }
  }

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !completed })
        .eq('id', taskId)

      if (error) throw error
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: !completed } : task
      ))
    } catch (error: any) {
      toast.error(`タスクの更新に失敗しました: ${error.message}`)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const generateTimeOptions = (start: string = "00:00") => {
    const [startHour, startMinute] = start.split(":").map(Number)
    const startIndex = startHour * 4 + startMinute / 15
    return Array.from({ length: 24 * 4 - startIndex }, (_, i) => {
      const totalMinutes = (startIndex + i + 1) * 15
      const hour = Math.floor(totalMinutes / 60)
      const minute = totalMinutes % 60
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    })
  }

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStartTime = e.target.value
    setStartTime(newStartTime)
    if (endTime && endTime <= newStartTime) {
      setEndTime('')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-purple-600 flex items-center">
          <ListTodo className="mr-2" />
          タスク管理
        </h1>
        <div className="flex items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mr-4 p-2 border border-purple-300 rounded"
          />
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4 flex">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="新しいタスク"
          className="flex-grow p-2 border border-purple-300 rounded-l"
        />
        <select
          value={startTime}
          onChange={handleStartTimeChange}
          className="p-2 border-t border-b border-purple-300"
        >
          <option value="">開始時間</option>
          {generateTimeOptions().map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="p-2 border-t border-b border-r border-purple-300"
          disabled={!startTime}
        >
          <option value="">終了時間</option>
          {generateTimeOptions(startTime).map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <button
          onClick={addTask}
          className="bg-purple-500 text-white p-2 rounded-r hover:bg-purple-600 transition duration-300"
        >
          追加
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center justify-between p-3 rounded ${
              task.completed ? 'bg-green-100' : 'bg-white'
            } border border-purple-200`}
          >
            <div className="flex items-center">
              <button
                onClick={() => toggleTaskCompletion(task.id, task.completed)}
                className={`mr-2 p-1 rounded-full ${
                  task.completed ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}
              >
                {task.completed ? <Check size={16} /> : <Circle size={16} />}
              </button>
              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                {task.description}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {task.start_time} - {task.end_time}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskManager