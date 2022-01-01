<div class="wrap php-run-once-page" data-mode="simple">
    <form id="php-run-once">

        <div class="php-run-once-editor-wrapper">
            <div class="php-run-once-editor">
                <p class="php-run-once-description">PHP code:</p>
                <pre><code class="language-php"></code></pre>
                <textarea id="php-run-once-code" data-php-code name="php-run-once-code" spellcheck="false" placeholder="Enter php code here"></textarea>
            </div>
            <div class="php-run-once-log">
                <p class="php-run-once-description">Output:</p>
                <pre><code></code></pre>
            </div>
        </div>

        <?php PHP_run::get_template('php-run-admin-actions.php'); ?>
    </form>

</div>