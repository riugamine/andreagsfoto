'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Compara con la variable de entorno
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid password')
      setPassword('')
    }
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Staff only Access
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border 
                       border-gray-300 dark:border-gray-600 
                       placeholder-gray-500 dark:placeholder-gray-400 
                       text-gray-900 dark:text-white 
                       bg-white dark:bg-gray-700
                       focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                       focus:z-10 sm:text-sm"
              placeholder="Enter admin password"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 
                     border border-transparent text-sm font-medium rounded-md 
                     text-white bg-blue-600 hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 dark:focus:ring-offset-gray-800"
          >
            Access Studio Panel
          </button>
        </form>
      </div>
    </div>
  )
}