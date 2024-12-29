import React from 'react'
import DoorOpen from '../img/dooropen.png'
import DoorClose from '../img/doorclosed.png'

interface DoorProps {
    open: boolean;
    handleSwitch: () => void;
    className?: string;
}

export const Door: React.FC<DoorProps> = ({ open, handleSwitch, className }) => {
    return (
        <div onClick={handleSwitch} className={`cursor-pointer ml-28 ${className}`}>
                <img src={open ? DoorOpen : DoorClose} alt="Door" />
        </div>
    )
}
