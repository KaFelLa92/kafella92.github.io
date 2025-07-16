import { useState } from "react";


function ToggleButton() {
    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        setIsOn(!isOn);
    }

    return(
        <button onClick={handleToggle}>
            {isOn ? 'ON' : 'OFF'}
        </button>
    );
}

export default ToggleButton;