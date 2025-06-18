'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AdminIndex = () => {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const adminLoggedIn = localStorage.getItem('adminLoggedIn')
    if (adminLoggedIn === 'true') {
      router.push('/admin/dashboard')
    } else {
      router.push('/admin/login')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-white text-xl">Redirecting...</div>
    </div>
  )
}

export default AdminIndex