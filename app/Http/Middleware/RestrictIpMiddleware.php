<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RestrictIpMiddleware
{
    // List of allowed IPs
    protected $allowedIps = [
        //'127.0.0.1',       // localhost
    ];

    public function handle(Request $request, Closure $next)
    {
        if (!in_array($request->ip(), $this->allowedIps)) {
            abort(403, 'Your IP address is not authorized.');
        }

        return $next($request);
    }
}
