'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Topic } from '@/lib/supabase'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { useState } from 'react'

export function TopicManagement() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<Topic>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTopic, setNewTopic] = useState({
    title: '',
    active: true,
    daily_limit: 5,
  })

  const { data: topics, isLoading } = useQuery<Topic[]>({
    queryKey: ['topics'],
    queryFn: async () => {
      const res = await fetch('/api/topics')
      if (!res.ok) throw new Error('Failed to fetch topics')
      return res.json()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Topic> }) => {
      const res = await fetch(`/api/topics/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update topic')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      setEditingId(null)
      setEditForm({})
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: typeof newTopic) => {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create topic')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      setShowAddForm(false)
      setNewTopic({ title: '', active: true, daily_limit: 5 })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/topics/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete topic')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })

  const startEdit = (topic: Topic) => {
    setEditingId(topic.id)
    setEditForm(topic)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEdit = (id: number) => {
    updateMutation.mutate({ id, data: editForm })
  }

  const toggleActive = (topic: Topic) => {
    updateMutation.mutate({
      id: topic.id,
      data: { active: !topic.active },
    })
  }

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 rounded-lg h-64" />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🏷️ Konular</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'İptal' : 'Yeni Konu'}
        </button>
      </div>

      {/* Yeni Konu Formu */}
      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-4">Yeni Konu Ekle</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Konu adı"
              value={newTopic.title}
              onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Günlük limit"
              value={newTopic.daily_limit}
              onChange={(e) => setNewTopic({ ...newTopic, daily_limit: parseInt(e.target.value) })}
              className="px-3 py-2 border rounded-lg"
            />
            <button
              onClick={() => createMutation.mutate(newTopic)}
              disabled={!newTopic.title}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              Ekle
            </button>
          </div>
        </div>
      )}

      {/* Konu Listesi */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Konu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Günlük Limit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kullanım
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topics?.map((topic) => (
              <tr key={topic.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === topic.id ? (
                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    <span className="font-medium text-gray-900">{topic.title}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === topic.id ? (
                    <input
                      type="number"
                      value={editForm.daily_limit || 0}
                      onChange={(e) => setEditForm({ ...editForm, daily_limit: parseInt(e.target.value) })}
                      className="w-20 px-2 py-1 border rounded"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{topic.daily_limit}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((topic.usage_count / topic.daily_limit) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {topic.usage_count}/{topic.daily_limit}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleActive(topic)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      topic.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {topic.active ? '✅ Aktif' : '❌ Pasif'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingId === topic.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => saveEdit(topic.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(topic)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`${topic.title} konusunu silmek istediğinize emin misiniz?`)) {
                            deleteMutation.mutate(topic.id)
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}