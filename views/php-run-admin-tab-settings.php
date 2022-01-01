<div class="wrap php-run-once-page">
    <div class="php-run-settings">
        <form method="post" action="options.php" id="php-run-settings-form">
            <?php
            settings_fields('php_run_settings');
            do_settings_sections('php-run');
            submit_button();
            ?>
        </form>
        <div class="php-run-scripts php-run-box">
            <h3>Manage saved scripts</h3>
            <p>All scripts stored in browser localStorage</p>
            <h4>Simple</h4>
            <div class="simple-scripts">
            </div>
            <h4>Advanced</h4>
            <div class="advanced-scripts">
            </div>
        </div>
    </div>
</div>