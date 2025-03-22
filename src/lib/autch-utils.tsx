"use client"

import { useQueryClient } from "@tanstack/react-query"

export function useInvalidateQueriesOnAuth() {
  const queryClient = useQueryClient()

  const invalidateAllQueries = () => {
    queryClient.invalidateQueries()
    queryClient.refetchQueries()
  }

  return { invalidateAllQueries }
}
