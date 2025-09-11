import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/store/stock-report')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Coming soon</div>
}
