import { StatsOverview } from '@/components/dashboard/stats-overview'
import { PostList } from '@/components/dashboard/post-list'
import { FunctionTrigger } from '@/components/dashboard/function-trigger'
import { LogoutButton } from '@/components/auth/logout-button'
import Link from 'next/link'
import { Settings } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📊 Social Media Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              AI-powered content management system
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/management"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              Yönetim
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Stats */}
        <StatsOverview />

        {/* Manuel Fonksiyon Tetikleme */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">⚡ Manuel Fonksiyon Tetikleme</h2>
          <FunctionTrigger />
        </div>

        {/* Posts Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">📝 Postlar</h2>
          <PostList />
        </div>
      </div>
    </main>
  )
}