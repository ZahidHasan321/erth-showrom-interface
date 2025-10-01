import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$main/orders/customer-profiles-orders')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Coming soon</div>
}
