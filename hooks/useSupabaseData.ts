import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useSupabaseData<T>(
  table: string,
  options?: {
    column?: string
    ascending?: boolean
    limit?: number
  }
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      let query = supabase.from(table).select('*')

      if (options?.column) {
        query = query.order(options.column, {
          ascending: options?.ascending ?? true
        })
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data: result, error } = await query

      if (error) throw error

      setData(result)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch: fetchData }
} 