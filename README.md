# PHP Run

WordPress PHP editor for running code from dashboard for administrators. Code and run PHP scripts.

> This plugin uses eval php function. If you don't understand every script that you evaluate don't use this plugin. You can harm your website. This plugin is for developers only.

## Description

You can run simple code like getting user meta.

There is more advanced mode as well. Run heavy code that will be processed in chunks. For example, you have 100 000 posts with custom meta fields that you want to change, do it in this way:
- Write code to get posts IDs
- Write code to process single post.
- Set chunk size.
- Press execute! 
- Wait watching progress and debug information.

You can save your code to use later. Code gets saved on client side in localStorge.

## Installation

1. Upload the plugin files (php-run.zip) to `/wp-content/plugins/php-run` directory, or install plugin through the WordPress plugins screen directly.
2. Activate plugin through `Plugins` screen in WordPress Admin Panel.
3. Use `Tools -> PHP Run` screen to start coding.

### Who do I talk to? ###

* Created by: https://evdesign.ru/