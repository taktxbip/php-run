=== Plugin Name ===
Contributors: evnomad
Donate link: https://ko-fi.com/evnomad
Tags: php, execute, code, developer, bulk, php code, php script, execute php
Requires at least: 4.7
Tested up to: 5.8
Stable tag: 1.0
Requires PHP: 7.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

PHP editor in WordPress dashboard for administrator. Code and run PHP scripts.

== Description ==

Run custom PHP scripts from WordPress dashboard. PHP Run plugin is for developers. 

You can run simple code like getting user meta.

There is more advanced mode as well. Run heavy code that will be processed in chunks. For example, you have 100 000 posts with custom meta fields that you want to change, do it in this way:
- Write code to get posts IDs
- Write code to process single post.
- Set chunk size.
- Press execute! 
- Wait watching progress and debug information.

You can save your code to use later. Code gets saved on client side in localStorge.

#### How does this work?

Plugin sends code via AJAX request, executes and send back output. For advanced mode, it executes code in chunk mode. Chunk size can be set on settings page. Only super administrator can use this plugin.

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/php-run` directory, or install plugin through the WordPress plugins screen directly.
2. Activate plugin through `Plugins` screen in WordPress Admin Panel.
3. Use `Tools -> PHP Run` screen to start coding.

That's all! Your website is already loading faster!

== Frequently Asked Questions ==

= Why was this plugin created? =

I created it for personal use, but since it is very handy for a developer, I decided to make it public.

= Is it safe? =

I understand the importance of security in that kind of plugin. Yes, it is safe, only super administrator can run code.

== Screenshots ==

1. Simple mode
2. Advanced mode. Code generates posts.
3. Settings tab.

== Changelog ==

= 1.0 =
* A change since the previous version.
* Another change.

= 1.0 =
* First version. Simple and advanced modes. Chunk size setting. Save scripts feature.

== Upgrade Notice ==

= 1.0 =
This is the first public stable version.