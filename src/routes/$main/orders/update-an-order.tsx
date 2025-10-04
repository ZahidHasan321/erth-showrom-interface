import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$main/orders/update-an-order')({
  component: RouteComponent,
  head: () => ({
    meta: [{
      title: "Update an Order",
    }]
  }),
})

function RouteComponent() {
  return <div>Coming soon</div>
}
