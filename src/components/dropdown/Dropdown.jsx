import classNames from 'classnames'
import React, { createContext, useEffect, useState } from 'react'

export const DropdownContext = createContext({})

function Dropdown({ children, placeholder, onChange, invalid, value }) {
  const [isDropdown, setIsDropdown] = useState(false)
  const [selected, setSelected] = useState(value || '')
  const [selectedText, setSelectedText] = useState('')
  const containerRef = React.useRef(null)

  useEffect(() => {
    setSelectedText(placeholder)
  }, [placeholder])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && containerRef.current.contains(event.target))
        return
      setIsDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (selected && onChange) {
      onChange(selected)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  const handleItemClick = item => {
    setSelected(item)
    setSelectedText(item)
    setIsDropdown(false)
  }

  return (
    <div className={'relative'} ref={containerRef}>
      <div
        className={classNames(
          'px-[12px] flex justify-between items-center w-full h-[40px] bg-input-bg focus:outline-none text-input-text rounded-[8px] text-xs font-normal cursor-pointer',
          {
            'border border-solid border-red-500': invalid,
            'rounded-b-none': isDropdown
          }
        )}
        onClick={() => setIsDropdown(prev => !prev)}
      >
        <span>{selectedText}</span>
        <svg
          className={classNames(
            'transition-all duration-300 ease-in transform',
            isDropdown ? 'rotate-180' : 'rotate-0'
          )}
          width='16'
          height='9'
          viewBox='0 0 16 9'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M1.06738 0.649414L7.99609 7.57788L14.9246 0.649414'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
      {isDropdown && (
        <div
          className='absolute z-50 right-0 w-full overflow-y-scroll no-scrollbar py-2.5 rounded-lg bg-input-bg transition-all duration-300 ease-in max-h-60
          border border-solid border-input-border shadow-input-shadow
          border-[#dcdcdc]'
        >
          <DropdownContext.Provider
            value={{ setSelected, setSelectedText, setIsDropdown }}
          >
            <ul className='w-full'>
              {React.Children.map(children, child =>
                React.cloneElement(child, {
                  onItemClick: handleItemClick
                })
              )}
            </ul>
          </DropdownContext.Provider>
        </div>
      )}
    </div>
  )
}

export default Dropdown
