/**
 * React Router DOM Compatibility Layer
 * 
 * This file provides drop-in replacements for react-router-dom hooks
 * to ease migration to TanStack Router.
 */

import {
  Link as TanStackLink,
  useRouter,
  useNavigate as useTanStackNavigate,
  useParams as useTanStackParams,
  type HistoryState,
} from '@tanstack/react-router'
import React, { forwardRef } from 'react'

/**
 * Type-safe Link component compatible with react-router patterns
 */
type LinkProps = {
  to: string
  children: React.ReactNode
  className?: string
  replace?: boolean
  state?: HistoryState
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkComponent({ to, children, className, replace, state, ...rest }, ref) {
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

/**
 * useNavigate hook with react-router compatible API
 */
export function useNavigate() {
  const navigate = useTanStackNavigate()

  return (to: string, options?: { replace?: boolean; state?: HistoryState }) => {
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
export function useParams<T extends Record<string, string>>(): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useTanStackParams({ strict: false } as any) as T
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

  React.useEffect(() => {
    navigate({ to, replace })
  }, [navigate, to, replace])

  return null
}

/**
 * Outlet re-export for layout routes
 */
export { Outlet } from '@tanstack/react-router'
