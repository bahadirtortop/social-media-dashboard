'use client'

import { useQuery } from '@tanstack/react-query'
import { StatsCard } from './stats-card'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Share2, 
  XCircle, 
  TrendingUp,
  Globe,
  Tag
} from 'lucide-react'

export function StatsOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/stats')
      if (!res.ok) throw new Error('Failed to fetch stats')
      return res.json()
    },
    refetchInterval: 30000, // 30 saniyede bir güncelle
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Toplam Post"
        value={stats?.total_posts || 0}
        icon={FileText}
        color="bg-blue-500"
      />
      <StatsCard
        title="Bekleyen"
        value={stats?.pending_posts || 0}
        icon={Clock}
        color="bg-yellow-500"
      />
      <StatsCard
        title="Onaylı"
        value={stats?.approved_posts || 0}
        icon={CheckCircle}
        color="bg-green-500"
      />
       <StatsCard
        title="Görsel Hazırlandı"
        value={stats?.image_generated || 0}
        icon={Share2}
        color="bg-purple-500"
      />
      <StatsCard
        title="Paylaım Bekleniyor"
        value={stats?.waiting_share_feed || 0}
        icon={Share2}
        color="bg-purple-500"
      />
      <StatsCard
        title="Yayınlandı"
        value={stats?.shared_posts || 0}
        icon={Share2}
        color="bg-purple-500"
      />
      <StatsCard
        title="Yayınlanan Hikayeler"
        value={stats?.shared_stories || 0}
        icon={Share2}
        color="bg-purple-500"
      />
      <StatsCard
        title="Başarısız"
        value={stats?.failed_posts || 0}
        icon={XCircle}
        color="bg-red-500"
      />
      <StatsCard
        title="Bugünkü Postlar"
        value={stats?.today_posts || 0}
        icon={TrendingUp}
        color="bg-indigo-500"
      />
      <StatsCard
        title="Aktif Ülkeler"
        value={stats?.active_countries || 0}
        icon={Globe}
        color="bg-teal-500"
      />
      <StatsCard
        title="Aktif Konular"
        value={stats?.active_topics || 0}
        icon={Tag}
        color="bg-pink-500"
      />
    </div>
  )
}