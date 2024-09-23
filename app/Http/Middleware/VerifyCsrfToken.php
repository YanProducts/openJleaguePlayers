<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Illuminate\Support\Facades\Log;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [

    ];

    /**
     * Indicates whether the XSRF-TOKEN cookie should be set on the response.
     *
    * @var bool
    */
   protected $addHttpCookie = true;

    /**
     * Get the CSRF token from the request cookies.
     *
     * @param \Illuminate\Http\Request $request
     * @return string|null
     */
    protected function getTokenFromRequest($request)
    {
        return $request->cookie('XSRF-TOKEN') ?: parent::getTokenFromRequest($request);
    }


}
