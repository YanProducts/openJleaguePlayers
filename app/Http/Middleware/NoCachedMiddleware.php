<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NoCachedMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // ヘッダーの履歴を消去する(ひとまず現時点で使うかは不明のため、そのままにしておく)
    public function handle(Request $request, Closure $next)
    {
        // レスポンスの後に処理すること
        $response = $next($request);

        // // レスポンス後にヘッダーの履歴を消す
        // $response->headers->set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        // $response->headers->set('Pragma', 'no-cache');
        // $response->headers->set('Expires', 'Wed, 11 Jan 1984 05:00:00 GMT');

        return $response;
    }


}
