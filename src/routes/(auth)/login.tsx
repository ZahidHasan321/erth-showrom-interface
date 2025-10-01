import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { redirect, useRouter, useRouterState } from '@tanstack/react-router'
import { z } from 'zod'
import sleep, { useAuth } from '@/context/auth'
import { BRAND_NAMES } from '@/lib/constants'

const fallback = '/' as const

export const Route = createFileRoute('/(auth)/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  const auth = useAuth()
  const router = useRouter()
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const navigate = Route.useNavigate()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const search = Route.useSearch()

  // Detect userType from redirect if exists
  const initialUserType: typeof BRAND_NAMES[keyof typeof BRAND_NAMES] =
    search.redirect?.startsWith(`/${BRAND_NAMES.fromHome}`)
      ? BRAND_NAMES.fromHome
      : search.redirect?.startsWith(`/${BRAND_NAMES.showroom}`)
      ? BRAND_NAMES.showroom
      : BRAND_NAMES.showroom // default if no redirect

  const [userType, setUserType] = React.useState<typeof BRAND_NAMES[keyof typeof BRAND_NAMES]>(
    initialUserType,
  )

  const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
    try {
      evt.preventDefault()
      const data = new FormData(evt.currentTarget)
      const identifier = data.get('username')?.toString()
      const password = data.get('password')?.toString()

      if (!identifier || !password) return

      await auth.login({
        username: identifier,
        password,
        userType,
      })

      await router.invalidate()
      await sleep(1) // hack for auth state update

      // Redirect logic
      if (userType === initialUserType && search.redirect) {
        // User kept the inferred type → follow redirect
        await navigate({ to: search.redirect })
      } else {
        // User changed type OR no redirect → send to type root
        await navigate({ to: `/${userType}` })
      }
    } catch (error) {
      console.error('Error logging in: ', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoggingIn = isLoading || isSubmitting

  return (
    <div className="p-2 grid gap-2 place-items-center">
      <h3 className="text-xl">
        {userType === BRAND_NAMES.showroom ? 'Erth Login' : 'Sakthba Login'}
      </h3>

      {search.redirect ? (
        <p className="text-red-500">You need to login to access this page.</p>
      ) : (
        <p>Login to see all the cool content in here.</p>
      )}

      <form className="mt-4 max-w-lg" onSubmit={onFormSubmit}>
        <fieldset disabled={isLoggingIn} className="w-full grid gap-4">
          <div className="grid gap-2 items-center min-w-[300px]">
            <label htmlFor="username-input" className="text-sm font-medium">
              Username or User ID
            </label>
            <input
              id="username-input"
              name="username"
              placeholder="Enter your username or ID"
              type="text"
              className="border rounded-md p-2 w-full"
              required
            />
          </div>

          <div className="grid gap-2 items-center min-w-[300px]">
            <label htmlFor="password-input" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password-input"
              name="password"
              placeholder="Enter your password"
              type="password"
              className="border rounded-md p-2 w-full"
              required
            />
            <label className="text-xs">Hint: password is 123</label>
          </div>

          <div className="grid gap-2 items-center min-w-[300px]">
            <label htmlFor="userType" className="text-sm font-medium">
              User Type
            </label>
            <select
              id="userType"
              name="userType"
              className="border rounded-md p-2 w-full"
              value={userType}
              onChange={(e) =>
                setUserType(e.target.value as typeof BRAND_NAMES[keyof typeof BRAND_NAMES])
              }
            >
              <option value={BRAND_NAMES.showroom}>{BRAND_NAMES.showroom}</option>
              <option value={BRAND_NAMES.fromHome}>{BRAND_NAMES.fromHome}</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md w-full disabled:bg-gray-300 disabled:text-gray-500"
          >
            {isLoggingIn ? 'Loading...' : 'Login'}
          </button>
        </fieldset>
      </form>
    </div>
  )
}