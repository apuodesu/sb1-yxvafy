import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { toast } from 'react-hot-toast'
import { UserPlus } from 'lucide-react'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      })
      if (error) throw error
      console.log('Registration response:', data)
      toast.success('登録確認メールを送信しました。メールをご確認ください。')
      navigate('/login')
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(`登録エラー: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold text-purple-600 mb-6 flex items-center justify-center">
        <UserPlus className="mr-3" size={30} /> 新規登録
      </h2>
      <form onSubmit={handleRegister} className="space-y-4">
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
          className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition duration-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '登録中...' : '登録'}
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        すでにアカウントをお持ちの方は{' '}
        <Link to="/login" className="text-purple-500 hover:underline">
          こちら
        </Link>
      </p>
    </div>
  )
}

export default Register