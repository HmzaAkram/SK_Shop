<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (AuthenticationException $e, Request $request): JsonResponse {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in.',
            ], 401);
        });

        $exceptions->render(function (ValidationException $e, Request $request): JsonResponse {
            return response()->json([
                'success' => false,
                'message' => 'The given data was invalid.',
                'errors'  => $e->errors(),
            ], 422);
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request): JsonResponse {
            return response()->json([
                'success' => false,
                'message' => 'The requested resource was not found.',
            ], 404);
        });

        $exceptions->render(function (HttpException $e, Request $request): JsonResponse {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'HTTP error.',
            ], $e->getStatusCode());
        });

        $exceptions->render(function (\Throwable $e, Request $request): ?JsonResponse {
            if (!$request->is('api/*')) {
                return null;
            }

            $message = config('app.debug') ? $e->getMessage() : 'An unexpected error occurred. Please try again later.';

            \Illuminate\Support\Facades\Log::error('Unhandled API exception', [
                'message'   => $e->getMessage(),
                'exception' => get_class($e),
                'file'      => $e->getFile(),
                'line'      => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $message,
            ], 500);
        });

    })->create();