import { Dashboard } from '@components/dashboard'

export const DashboardLayout = ({ children, title}) => {
    return (
        <Dashboard title={title}>{children}</Dashboard>
    )
}

export const Layout = (page) => <DashboardLayout>{page}</DashboardLayout>