import { Link, Head } from '@inertiajs/react';
import {useEffect} from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Welcome({ auth, laravelVersion, phpVersion,topRoute }) {
    useEffect(() => {
        if (auth.user) {
            Inertia.visit(topRoute);
        }
    }, [auth.user]);
    return (
        <>
            <Head title="Welcome" />
            <div>
                <div>
                    {!auth.user && (
                        <>
                            <Link
                                href={route('login')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
                                className="ms-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
