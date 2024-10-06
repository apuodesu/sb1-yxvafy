import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { toast } from 'react-hot-toast'
import { LogIn } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('ログインしました')
      navigate('/')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold text-purple-600 mb-6 flex items-center justify-center">
        <LogIn className="mr-3" size={30} /> ログイン
      </h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition duration-300"
        >
          ログイン
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        アカウントをお持ちでない方は{' '}
        <Link to="/register" className="text-purple-500 hover:underline">
          こちら
        </Link>
      </p>
    </div>
  )
}

export default Login