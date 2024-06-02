import { Link, Head,useForm } from '@inertiajs/react';
import {useEffect} from "react";
import { Inertia } from "@inertiajs/inertia";
// import route from 'ziggy-js';


// 「/」でアクセスされたら、ログインの可否に応じてリダイレクト
export default function Welcome({ auth, laravelVersion, phpVersion }){
    useEffect(() => {
        if (auth.user) {
            Inertia.visit("/topPage");
        }else{
            Inertia.visit("login");
        }
    }, []);
}
