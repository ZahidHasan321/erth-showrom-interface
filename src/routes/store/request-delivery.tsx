import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/store/request-delivery')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Coming soon</div>
}
