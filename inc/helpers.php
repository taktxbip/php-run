<?php

if (!function_exists('dbg')) {
    function dbg($var, $log = true)
    {
        if ($log) {
            error_log(print_r($var, true));
        } else {
            echo '<pre>';
            print_r($var);
            echo '</pre>';
        }
    }
}