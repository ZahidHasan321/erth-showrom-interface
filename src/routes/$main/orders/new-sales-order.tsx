import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$main/orders/new-sales-order')({
  component: RouteComponent,
  head: () => ({
    meta: [{
      title: "New Sales Order",
    }]
  }),
})

function RouteComponent() {
  return <div>Coming soon</div>
}
