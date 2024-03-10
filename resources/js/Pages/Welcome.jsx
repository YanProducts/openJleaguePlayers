import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div>
                <div>
                    {auth.user ? (
                        <Link
                            href={route('topPage')}
                        >
                            トップページ
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                            >
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
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
