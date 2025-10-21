'use client'

import { useState } from 'react'
import { Play, Loader2 } from 'lucide-react'

type FunctionName = 
  | 'generate-ai-content'
  | 'generate-images'
  | 'generate-story-image'
  | 'share-facebook-feed'
  | 'share-facebook-story'

interface FunctionConfig {
  name: FunctionName
  label: string
  description: string
  icon: string
  color: string
}

const functions: FunctionConfig[] = [
  {
    name: 'generate-ai-content',
    label: 'İçerik Üret',
    description: 'Yeni AI içeriği oluştur',
    icon: '✍️',
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'generate-images',
    label: 'Görsel Üret',
    description: 'Onaylı içerikler için görsel oluştur',
    icon: '🖼️',
    color: 'bg-green-600 hover:bg-green-700',
  },
  {
    name: 'generate-story-image',
    label: 'Story Görseli Üret',
    description: 'Story formatında görsel oluştur',
    icon: '📚',
    color: 'bg-purple-600 hover:bg-purple-700',
  },
  {
    name: 'share-facebook-feed',
    label: 'Feed Paylaş',
    description: 'Facebook feed\'e post paylaş',
    icon: '📱',
    color: 'bg-indigo-600 hover:bg-indigo-700',
  },
  {
    name: 'share-facebook-story',
    label: 'Story Paylaş',
    description: 'Facebook story\'e paylaş',
    icon: '📖',
    color: 'bg-pink-600 hover:bg-pink-700',
  },
]

export function FunctionTrigger() {
  const [loading, setLoading] = useState<FunctionName | null>(null)
  const [results, setResults] = useState<Record<string, any>>({})

  const triggerFunction = async (functionName: FunctionName) => {
    setLoading(functionName)
    setResults({ ...results, [functionName]: null })

    try {
      // Artık kendi API route'umuzu kullanıyoruz
      const res = await fetch(`/api/trigger/${functionName}`, {
        method: 'POST',
      })

      const result = await res.json()

      setResults({ 
        ...results, 
        [functionName]: { 
          success: result.success, 
          data: result.data,
          error: result.error 
        } 
      })
    } catch (error: any) {
      setResults({ 
        ...results, 
        [functionName]: { 
          success: false, 
          error: error.message 
        } 
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {functions.map((func) => (
        <div key={func.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{func.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{func.label}</h3>
                <p className="text-sm text-gray-500">{func.description}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => triggerFunction(func.name)}
            disabled={loading === func.name}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 ${
              loading === func.name
                ? 'bg-gray-400 cursor-not-allowed'
                : func.color
            }`}
          >
            {loading === func.name ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Çalışıyor...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Çalıştır
              </>
            )}
          </button>

          {/* Sonuç */}
          {results[func.name] && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                results[func.name].success
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {results[func.name].success ? (
                <div>
                  <p className="font-semibold mb-1">✅ Başarılı!</p>
                  <pre className="text-xs overflow-auto max-h-32">
                    {JSON.stringify(results[func.name].data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div>
                  <p className="font-semibold mb-1">❌ Hata!</p>
                  <p className="text-xs">{results[func.name].error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}