import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$main/orders/orders-at-showroom')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Coming soon</div>
}
