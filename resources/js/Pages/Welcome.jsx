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
                                className="base_link"
                            >
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
                                className="base_link"
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
