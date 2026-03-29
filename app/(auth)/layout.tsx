import { Provider } from '../provider'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>
}
