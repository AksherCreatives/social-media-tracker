import { Provider } from '../provider'

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>
}
