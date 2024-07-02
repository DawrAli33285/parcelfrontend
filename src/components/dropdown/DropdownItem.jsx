import { useContext } from 'react'
import { DropdownContext } from './Dropdown.jsx'

function DropdownItem({ children, value }) {
  const { setSelected, setSelectedText, setIsDropdown } =
    useContext(DropdownContext)

  return (
    <li
      onClick={() => {
        setSelected(value)
        setSelectedText(children)
        setIsDropdown(false)
      }}
      className='cursor-pointer px-[12px] py-2 w-full text-xs font-normal text-input-text hover:bg-grey-hover'
    >
      {children}
    </li>
  )
}

export default DropdownItem
