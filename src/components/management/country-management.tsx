'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Country } from '@/lib/supabase'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { useState } from 'react'

export function CountryManagement() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<Country>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCountry, setNewCountry] = useState({
    name: '',
    flag_emoji: '',
    is_active: true,
    daily_limit: 5,
  })

  const { data: countries, isLoading } = useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: async () => {
      const res = await fetch('/api/countries')
      if (!res.ok) throw new Error('Failed to fetch countries')
      return res.json()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Country> }) => {
      const res = await fetch(`/api/countries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update country')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] })
      setEditingId(null)
      setEditForm({})
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: typeof newCountry) => {
      const res = await fetch('/api/countries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create country')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] })
      setShowAddForm(false)
      setNewCountry({ name: '', flag_emoji: '', is_active: true, daily_limit: 5 })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/countries/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete country')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] })
    },
  })

  const startEdit = (country: Country) => {
    setEditingId(country.id)
    setEditForm(country)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEdit = (id: number) => {
    updateMutation.mutate({ id, data: editForm })
  }

  const toggleActive = (country: Country) => {
    updateMutation.mutate({
      id: country.id,
      data: { active: !country.active },
    })
  }

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 rounded-lg h-64" />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🌍 Ülkeler</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'İptal' : 'Yeni Ülke'}
        </button>
      </div>

      {/* Yeni Ülke Formu */}
      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-4">Yeni Ülke Ekle</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Ülke adı"
              value={newCountry.name}
              onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Bayrak emoji (🇹🇷)"
              value={newCountry.flag_emoji}
              onChange={(e) => setNewCountry({ ...newCountry, flag_emoji: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Günlük limit"
              value={newCountry.daily_limit}
              onChange={(e) => setNewCountry({ ...newCountry, daily_limit: parseInt(e.target.value) })}
              className="px-3 py-2 border rounded-lg"
            />
            <button
              onClick={() => createMutation.mutate(newCountry)}
              disabled={!newCountry.name || !newCountry.flag_emoji}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              Ekle
            </button>
          </div>
        </div>
      )}

      {/* Ülke Listesi */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ülke
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
            {countries?.map((country) => (
              <tr key={country.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === country.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editForm.flag_emoji || ''}
                        onChange={(e) => setEditForm({ ...editForm, flag_emoji: e.target.value })}
                        className="w-16 px-2 py-1 border rounded text-center"
                        placeholder="🇹🇷"
                      />
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="flex-1 px-2 py-1 border rounded"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{country.flag_emoji}</span>
                      <span className="font-medium text-gray-900">{country.name}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === country.id ? (
                    <input
                      type="number"
                      value={editForm.daily_limit || 0}
                      onChange={(e) => setEditForm({ ...editForm, daily_limit: parseInt(e.target.value) })}
                      className="w-20 px-2 py-1 border rounded"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{country.daily_limit}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((country.usage_count / country.daily_limit) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {country.usage_count}/{country.daily_limit}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleActive(country)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      country.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {country.active ? '✅ Aktif' : '❌ Pasif'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingId === country.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => saveEdit(country.id)}
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
                        onClick={() => startEdit(country)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`${country.name} ülkesini silmek istediğinize emin misiniz?`)) {
                            deleteMutation.mutate(country.id)
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