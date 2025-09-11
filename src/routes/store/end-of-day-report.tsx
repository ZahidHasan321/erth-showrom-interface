import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/store/end-of-day-report')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Coming soon</div>
}
