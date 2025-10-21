import { CountryManagement } from '@/components/management/country-management'
import { TopicManagement } from '@/components/management/topic-management'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ManagementPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ⚙️ Yönetim Paneli
            </h1>
            <p className="text-gray-600 mt-2">
              Ülke ve konu ayarlarını yönet
            </p>
          </div>
        </div>

        {/* Country Management */}
        <div className="mb-8">
          <CountryManagement />
        </div>

        {/* Topic Management */}
        <div>
          <TopicManagement />
        </div>
      </div>
    </main>
  )
}