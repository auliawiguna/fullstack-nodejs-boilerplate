import { Dashboard } from '@components/dashboard'

export const DashboardLayout = ({ children }) => {
    return (
        <Dashboard>{children}</Dashboard>
    )
}

export const Layout = (page) => <DashboardLayout>{page}</DashboardLayout>