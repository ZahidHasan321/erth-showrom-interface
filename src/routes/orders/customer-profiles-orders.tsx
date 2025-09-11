import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/orders/customer-profiles-orders')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Coming soon</div>
}
