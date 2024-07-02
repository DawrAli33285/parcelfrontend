import PropTypes from 'prop-types'
import DashboardHeader from './DashboardHeader'
import DashboardSidebar from './DashboardSidebar'

function DashboardWrapper({ title, children }) {
  return (
    <div className='w-full h-screen flex flex-col'>
      <DashboardHeader title={title} />
      <div className='flex-grow relative m-[12px] ml-[10px]'>
        <div className='absolute inset-0 flex flex-col lg:grid lg:grid-cols-4 gap-[10px] max-w-[1200px] lg:mx-auto overflow-y-auto no-scrollbar'>
          {children}
          <DashboardSidebar />
        </div>
      </div>
    </div>
  )
}

DashboardWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
}

export default DashboardWrapper
