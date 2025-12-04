/**
 * React Router DOM Compatibility Layer
 * 
 * This file provides drop-in replacements for react-router-dom hooks
 * to ease migration to TanStack Router.
 * 
 * MIGRATION GUIDE:
 * 1. Replace imports from 'react-router-dom' with '@/utils/router-compat'
 * 2. The API is designed to be as similar as possible
 * 
 * After migration is complete, you can switch to native TanStack Router hooks.
 */

import {
  Link as TanStackLink,
  useRouter,
  useNavigate as useTanStackNavigate,
  useParams as useTanStackParams,
  type LinkProps as TanStackLinkProps,
} from '@tanstack/react-router'
import { forwardRef } from 'react'

/**
 * Type-safe Link component compatible with react-router patterns
 */
type LinkProps = {
  to: string
  children: React.ReactNode
  className?: string
  replace?: boolean
  state?: unknown
  onClick?: (e: React.MouseEvent) => void
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, children, className, replace, state, ...rest }, ref) => {
    return (
      <TanStackLink
        ref={ref}
        to={to}
        className={className}
        replace={replace}
        state={state}
        {...rest}
      >
        {children}
      </TanStackLink>
    )
  }
)

Link.displayName = 'Link'

/**
 * useNavigate hook with react-router compatible API
 */
export function useNavigate() {
  const navigate = useTanStackNavigate()

  return (to: string, options?: { replace?: boolean; state?: unknown }) => {
    navigate({
      to,
      replace: options?.replace,
      state: options?.state,
    })
  }
}

/**
 * useLocation hook - returns location info
 */
export function useLocation() {
  const router = useRouter()
  return {
    pathname: router.state.location.pathname,
    search: router.state.location.search,
    hash: router.state.location.hash,
    state: router.state.location.state,
  }
}

/**
 * useParams hook - returns route params
 */
export function useParams<T extends Record<string, string>>() {
  return useTanStackParams({ strict: false }) as T
}

/**
 * Navigate component for declarative navigation
 */
export function Navigate({
  to,
  replace = false,
}: {
  to: string
  replace?: boolean
}) {
  const navigate = useTanStackNavigate()

  // Perform navigation on mount
  if (typeof window !== 'undefined') {
    navigate({ to, replace })
  }

  return null
}

/**
 * Outlet re-export for layout routes
 */
export { Outlet } from '@tanstack/react-router'
