import React from 'react'
import DoorOpen from '../img/dooropen.png'
import DoorClose from '../img/doorclosed.png'

interface DoorProps {
    open: boolean;
    handleSwitch: () => void;
    isSwitchDisabled: boolean;
}

export const Door: React.FC<DoorProps> = ({ open, handleSwitch, isSwitchDisabled }) => {
    return (
        <div onClick={handleSwitch} className={`${isSwitchDisabled?"cursor-not-allowed":"cursor-pointer"} ml-28 `}>
                <img src={open ? DoorOpen : DoorClose} alt="Door" />
        </div>
    )
}
