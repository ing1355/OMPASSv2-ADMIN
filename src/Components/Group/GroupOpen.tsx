import { useState } from 'react'
import groupOpenIcon from '@assets/groupOpenIcon.png'
import groupOpenedIcon from '@assets/groupOpenedIcon.png'
import groupOpenIconHover from '@assets/groupOpenIconHover.png'
import groupOpenedIconHover from '@assets/groupOpenedIconHover.png'
import groupOpenIconColor from '@assets/groupOpenIconColor.png'
import groupOpenedIconColor from '@assets/groupOpenedIconColor.png'

type GroupOpenProps = {
    opened: boolean
    selected: boolean
    onClick: React.DOMAttributes<HTMLImageElement>['onClick']
}

const GroupOpen = ({selected, opened, onClick}: GroupOpenProps) => {
    const [mOver, setMOver] = useState(false)
    return <>
        <img src={selected ? (opened ? groupOpenedIconColor : groupOpenIconColor) : (mOver ? (opened ? groupOpenedIconHover : groupOpenIconHover) : (opened ? groupOpenedIcon : groupOpenIcon))} data-opened={opened} onClick={onClick} onMouseEnter={() => {
            setMOver(true)
        }} onMouseLeave={() => {
            setMOver(false)
        }}/>
    </>
}

export default GroupOpen