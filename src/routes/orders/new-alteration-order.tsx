import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/orders/new-alteration-order')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Coming soon</div>
}
