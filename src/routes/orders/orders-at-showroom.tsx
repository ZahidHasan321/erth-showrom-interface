import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/orders/orders-at-showroom')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Coming soon</div>
}
