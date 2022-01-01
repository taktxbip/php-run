<div class="wrap php-run-once-tabs">
    <h1><?php echo esc_html(get_admin_page_title()) ?></h1>
    <p>With great power comes great responsibility</p>

    <nav class="nav-tab-wrapper">
        <a href="?page=php-run" class="nav-tab <?php if ($active_tab === null) : ?>nav-tab-active<?php endif; ?>">Simple</a>
        <a href="?page=php-run&tab=advanced" class="nav-tab <?php if ($active_tab === 'advanced') : ?>nav-tab-active<?php endif; ?>">Advanced</a>
        <a href="?page=php-run&tab=settings" class="nav-tab <?php if ($active_tab === 'settings') : ?>nav-tab-active<?php endif; ?>">Settings</a>
        <a href="?page=php-run&tab=about" class="nav-tab <?php if ($active_tab === 'about') : ?>nav-tab-active<?php endif; ?>">About</a>
    </nav>
</div>