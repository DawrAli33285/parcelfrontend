import PropTypes from 'prop-types'
import { Outlet } from 'react-router-dom'
import DashboardTransition from '../components/DashboardTransition'
import DashboardWrapper from '../components/DashboardWrapper'
import TicketList from '../components/TicketList.jsx'

function Ticket({ title }) {
  return (
    <DashboardWrapper title={title}>
      <DashboardTransition>
        <div className='lg:absolute lg:inset-0 lg:overflow-y-auto no-scrollbar'>
          <div className='w-full min-h-full flex flex-col md:flex-row gap-[14px]'>
            <TicketList />
            <Outlet />
          </div>
        </div>
      </DashboardTransition>
    </DashboardWrapper>
  )
}

Ticket.propTypes = {
  title: PropTypes.string
}

export default Ticket
