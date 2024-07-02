import DashboardTransition from '../../components/DashboardTransition'
import DashboardWrapper from '../../components/DashboardWrapper'

function AdminMain({ title }) {
  return (
    <DashboardWrapper title={title}>
      <DashboardTransition>
        <div className='lg:absolute lg:inset-0 lg:overflow-y-auto no-scrollbar'>
          <div className='w-full bg-white rounded-lg pt-[38px] pb-[44px] pl-[33px] pr-[48px] flex flex-col'>
            <h1>Admin Home</h1>
          </div>
        </div>
      </DashboardTransition>
    </DashboardWrapper>
  )
}

export default AdminMain
