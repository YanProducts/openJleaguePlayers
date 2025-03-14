<?php

// ipアドレスを制限するためのミドルウェア


namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RestrictedIPMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $allowed_ip_lists=[
            env("ALLOWED_IP_LOCAL"),
            env("ALLOWED_IP_WIFI"),
            env("ALLOWED_IP_DEVICE"),
        ];
        if(!in_array($request->ip(),$allowed_ip_lists)){
            abort(403,"許可されていないipです");
        }

        // 全ての処理が終わった後に次の処理へ
        return $next($request);
    }
}
