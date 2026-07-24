<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Public installment lookup: prevent CNIC-enumeration / scraping abuse.
        RateLimiter::for('track-installment', function ($request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        // Login: prevent brute-forcing the single admin password.
        RateLimiter::for('login', function ($request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}