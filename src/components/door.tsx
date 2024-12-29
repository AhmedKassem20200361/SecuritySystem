import React from 'react'
import DoorOpen from '../img/dooropen.png'
import DoorClose from '../img/doorclosed.png'

interface DoorProps {
    open: boolean;
    handleSwitch: () => void;
    className?: string;
    isSwitchDisabled: boolean;
}

export const Door: React.FC<DoorProps> = ({ open, handleSwitch, className, isSwitchDisabled }) => {
    return (
        <div onClick={handleSwitch} className={`${isSwitchDisabled?"cursor-not-allowed":"cursor-pointer"} ml-28 ${className}`}>
                <img src={open ? DoorOpen : DoorClose} alt="Door" />
        </div>
    )
}
