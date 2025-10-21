'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Post } from '@/lib/supabase'
import { CheckCircle, XCircle, Eye, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import Image from 'next/image'
import { useState } from 'react'

export function PostList() {
  const [filter, setFilter] = useState<string>('all')
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set())
  const queryClient = useQueryClient()

  const toggleExpand = (postId: number) => {
    const newExpanded = new Set(expandedPosts)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedPosts(newExpanded)
  }

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['posts', filter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filter !== 'all') params.set('status', filter)
      
      const res = await fetch(`/api/posts?${params}`)
      if (!res.ok) throw new Error('Failed to fetch posts')
      return res.json()
    },
    refetchInterval: 10000,
  })

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update post')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete post')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: '⏳ Bekliyor' },
      approved: { color: 'bg-green-100 text-green-800', text: '✅ Onaylı' },
      rejected: { color: 'bg-red-100 text-red-800', text: '❌ Reddedildi' },
      image_generated: { color: 'bg-blue-100 text-blue-800', text: '🖼️ Görsel Hazır' },
      story_generated: { color: 'bg-purple-100 text-purple-800', text: '📚 Story Hazır' },
      published: { color: 'bg-indigo-100 text-indigo-800', text: '🚀 Yayınlandı' },
      failed: { color: 'bg-red-100 text-red-800', text: '🔥 Başarısız' },
    }
    return badges[status] || { color: 'bg-gray-100 text-gray-800', text: status }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Filtreler */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'approved', 'image_generated', 'published', 'failed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status === 'all' ? 'Tümü' : getStatusBadge(status).text}
          </button>
        ))}
      </div>

      {/* Post Listesi */}
      <div className="space-y-4">
        {posts?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Bu filtrede post bulunamadı.
          </div>
        )}

        {posts?.map((post) => {
          const isExpanded = expandedPosts.has(post.id)
          
          return (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-6">
                {/* Görsel */}
                {post.image_url && (
                  <div className="flex-shrink-0">
                    <Image
                      src={post.image_url}
                      alt={post.content_title}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}

                {/* İçerik */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {post.content_title}
                    </h3>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadge(post.status).color}`}>
                        {getStatusBadge(post.status).text}
                      </span>
                    </div>
                  </div>

                  {/* İçerik Metni - Genişletilebilir */}
                  <div className="mb-3">
                    <p className={`text-gray-600 text-sm whitespace-pre-wrap ${!isExpanded ? 'line-clamp-3' : ''}`}>
                      {post.content_text}
                    </p>
                    <button
                      onClick={() => toggleExpand(post.id)}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Daha az göster
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Tamamını göster
                        </>
                      )}
                    </button>
                  </div>

                  {/* Alt Bilgiler */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>📅 {format(new Date(post.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}</span>
                    {post.shared_to_facebook && (
                      <span className="text-green-600">✅ Feed paylaşıldı</span>
                    )}
                    {post.story_shared_to_facebook && (
                      <span className="text-purple-600">✅ Story paylaşıldı</span>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-2 mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(post.feed_status).color}`}>
                      Feed: {getStatusBadge(post.feed_status).text}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(post.story_status).color}`}>
                      Story: {getStatusBadge(post.story_status).text}
                    </span>
                  </div>

                  {/* Aksiyonlar */}
                  <div className="flex gap-2">
                    {post.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updatePostMutation.mutate({ id: post.id, status: 'approved' })}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Onayla
                        </button>
                        <button
                          onClick={() => updatePostMutation.mutate({ id: post.id, status: 'rejected' })}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Reddet
                        </button>
                      </>
                    )}

                    {post.image_url && (
                      <a
                        href={post.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Görseli Gör
                      </a>
                    )}

                    {post.story_image_url && (
                      <a
                        href={post.story_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Story Gör
                      </a>
                    )}

                    <button
                      onClick={() => {
                        if (confirm('Bu postu silmek istediğinize emin misiniz?')) {
                          deletePostMutation.mutate(post.id)
                        }
                      }}
                      className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}