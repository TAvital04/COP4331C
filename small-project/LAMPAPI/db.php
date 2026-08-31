<?php

function loadEnv($envPath)
{
    if (!file_exists($envPath)) {
        return;
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) {
            continue;
        }
        if (strpos($line, '=') !== false) {
            list($key, $val) = explode('=', $line, 2);
            $key = trim($key);
            $val = trim(trim($val), '"\'');
            if (!array_key_exists($key, $_SERVER) && !array_key_exists($key, $_ENV)) {
                putenv("{$key}={$val}");
                $_ENV[$key] = $val;
                $_SERVER[$key] = $val;
            }
        }
    }
}

function getDbConnection()
{
    // Load .env from project folder or workspace root if present
    loadEnv(__DIR__ . '/../.env');
    loadEnv(__DIR__ . '/../../.env');

    $host = getenv('DB_HOST') ?: 'localhost';
    $user = getenv('DB_USER') ?: 'TheBeast';
    $pass = getenv('DB_PASSWORD') ?: 'WeLoveCOP4331';
    $db   = getenv('DB_NAME') ?: 'COP4331';

    $conn = new mysqli($host, $user, $pass, $db);
    return $conn;
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true) ?? [];
}
?>
