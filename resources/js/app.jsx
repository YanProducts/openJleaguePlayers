import './bootstrap';
import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';



const appName = import.meta.env.VITE_APP_NAME || 'Laravel';


createInertiaApp({

    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {

    function AlertTheSitesIsUncompleted(){
        React.useEffect(()=>{
            // alert("このサイトは実験中です。\nこの間に保存されたデータは、数日〜数週間の間に破棄されます")
        },[])
        return(<App {...props}/>)
    }


    const root = createRoot(el);
    // root.render(<App {...props} />);
    root.render(<AlertTheSitesIsUncompleted/>);
    },
    progress: {
        color: '#4B5563',
    },
});
