import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import * as React from 'react'
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
  head: () => ({
    meta: [{
      title: "Login",
    }]
  }),
})

function LoginComponent() {
  const auth = useAuth()
  const router = useRouter()
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <img
            src={userType === BRAND_NAMES.showroom ? '/erth-light.svg' : '/Sakkba.png'}
            alt={userType === BRAND_NAMES.showroom ? 'Erth Logo' : 'Sakkba Logo'}
            className="h-20 w-auto"
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {userType === BRAND_NAMES.showroom ? 'Erth Login' : 'Sakkba Login'}
        </h2>

        {search.redirect ? (
          <p className="text-red-500 text-center mb-4">
            You need to login to access this page.
          </p>
        ) : (
          <p className="text-gray-600 text-center mb-6">
            Welcome back! Please login to your account.
          </p>
        )}

        <form onSubmit={onFormSubmit}>
          <fieldset disabled={isSubmitting} className="space-y-6">
            <div className="grid gap-2 items-center min-w-[300px]">
              <label htmlFor="username-input" className="text-sm font-medium text-gray-700">
                Username or User ID
              </label>
              <input
                id="username-input"
                name="username"
                placeholder="Enter your username or ID"
                type="text"
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid gap-2 items-center min-w-[300px]">
              <label htmlFor="password-input" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password-input"
                name="password"
                placeholder="Enter your password"
                type="password"
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500">Hint: password is 123</p>
            </div>

            <div className="grid gap-2 items-center min-w-[300px]">
              <label htmlFor="userType" className="text-sm font-medium text-gray-700">
                Brand
              </label>
              <select
                id="userType"
                name="userType"
                className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={userType}
                onChange={(e) =>
                  setUserType(e.target.value as typeof BRAND_NAMES[keyof typeof BRAND_NAMES])
                }
              >
                <option value={BRAND_NAMES.showroom}>erth</option>
                <option value={BRAND_NAMES.fromHome}>sakkba</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}