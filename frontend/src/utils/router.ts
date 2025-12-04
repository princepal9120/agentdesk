/**
 * TanStack Router navigation utilities
 * Use these hooks in components instead of react-router-dom hooks
 */
import { useRouter, useNavigate, useSearch, useParams } from '@tanstack/react-router'

export { useNavigate, useSearch, useParams }

/**
 * Replacement for react-router's useLocation
 * Returns the current location state
 */
export function useLocationState<T = unknown>(): T | undefined {
  const router = useRouter()
  return router.state.location.state as T | undefined
}

/**
 * Replacement for react-router's useLocation
 * Returns pathname, search, and hash
 */
export function useLocation() {
  const router = useRouter()
  const { pathname, search, hash } = router.state.location
  return { pathname, search, hash }
}
