import { Link } from '@inertiajs/react';
import backgroundImage from '../../img/back.jpg';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen">
            <div className="min-h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize:"contain"}}>
                {children}
            </div>
        </div>
    );
}
