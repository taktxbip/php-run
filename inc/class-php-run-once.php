<?php
class PHP_Run_Once
{
    private static $instance = null;
    private $options_name = 'php_run_settings';
    private $settings_fields = [
        [
            'field_label' => 'Chunk Size',
            'field_name' => 'chunk_size',
            'description' => 'How many ids will be proccessed at one request. Maximum is 800. Use large values for light posts and small for heavy.',
            'default_value' => 80,
            'type' => 'number'
        ]
    ];

    public function __construct()
    {
        $this->register_menu();

        add_action('admin_init', [$this, 'register_settings']);

        $ajax = [
            'php_run_once_ajax',
            'php_run_advanced_chunk_ajax',
        ];

        foreach ($ajax as $name) {
            add_action('wp_ajax_' . $name, [$this, $name]);
            add_action('wp_ajax_nopriv_' . $name, [$this, $name]);
        }

        add_filter('plugin_action_links_php-run/php-run.php', [$this, 'php_run_once_to_editor_link']);
    }

    public function register_settings()
    {
        // If plugin settings don't exist, then create them
        if (!get_option($this->options_name)) add_option($this->options_name);

        add_settings_section(
            'php_run_settings_section',
            'Settings',
            null,
            'php-run'
        );

        foreach ($this->settings_fields as $field) {
            $args = [
                'field_name'  => $field['field_name'],
                'type' => $field['type']
            ];

            if (isset($field['description']) && $field['description']) {
                $args['description'] = __($field['description'], 'php-run');
            }

            if (isset($field['default_value']) && $field['default_value']) {
                $args['default_value'] = __($field['default_value'], 'php-run');
            }

            add_settings_field($field['field_name'], __($field['field_label'], 'php-run'), [$this, 'php_run_settings_fields_callback'], 'php-run', 'php_run_settings_section', $args);
        }

        register_setting($this->options_name, $this->options_name);
    }

    public function php_run_settings_fields_callback($args)
    {
        $value = $this->pre_field($args['field_name'], $args['default_value']);
        $name = $this->options_name . '[' . $args['field_name'] . ']';
        switch ($args['type']) {
            case 'text':
            case 'email':
                echo '<input type="' . $args['type'] . '" id="' . $args['field_name'] . '" name="' . $name . '" value="' . $value . '" />';
                break;
            case 'number':
                echo '<input min="1" max="800" type="' . $args['type'] . '" id="' . $args['field_name'] . '" name="' . $name . '" value="' . $value . '" />';
                break;
        }
        if (isset($args['description']) && $args['description']) {
            echo '<p class="description">' . $args['description'] . '</p>';
        }
    }

    private function pre_field($option_key, $default_val = '')
    {
        $options = get_option($this->options_name);

        if (isset($options[$option_key]) && $options[$option_key]) {
            return esc_html($options[$option_key]);
        }

        return $default_val;
    }

    private function register_menu()
    {
        add_action('admin_menu', function () {
            $submenu = add_submenu_page('tools.php', 'PHP Run', 'PHP Run', 'administrator', 'php-run', [$this, 'admin_tab_view'], 8);
        });
    }

    public function php_run_once_to_editor_link($links)
    {
        $url = esc_url(add_query_arg(
            'page',
            'php-run',
            get_admin_url() . 'admin.php'
        ));
        $settings_link = "<a href='{$url}'>" . __('Go to Editor') . '</a>';
        array_push($links, $settings_link);
        return $links;
    }

    public function admin_tab_view()
    {
        if (!current_user_can('administrator')) return;

        $active_tab = isset($_GET['tab']) && $_GET['tab'] ? sanitize_text_field($_GET['tab']) : null;

        PHP_run::get_template('php-run-admin-tabs.php', ['active_tab' => $active_tab]);
        $localize_args = [];
        switch ($active_tab) {
            case null:
                PHP_run::get_template('php-run-admin-tab-simple.php');
                break;
            case 'advanced':
                $options = get_option($this->options_name);
                $chunk_size = isset($options['chunk_size']) && $options['chunk_size'] ? $options['chunk_size'] : 80;
                $localize_args['chunkSize']  = $chunk_size;
                PHP_run::get_template('php-run-admin-tab-advanced.php');
                break;
            case 'settings':
                PHP_run::get_template('php-run-admin-tab-settings.php');
                break;
            case 'about':
                PHP_run::get_template('php-run-admin-tab-about.php');
                break;
            default:
                break;
        }

        wp_localize_script('php-run-scripts', 'phpRun', $localize_args);
    }

    public function php_run_advanced_chunk_ajax()
    {
        check_ajax_referer('myajax-nonce', 'nonce_code');

        if (!current_user_can('administrator')) wp_die();

        $ids = isset($_POST['ids']) ? $_POST['ids'] : false;

        if (!$ids) {
            wp_send_json(['status' => 0, 'message' => 'ids not set']);
            wp_die();
        }

        $formdata = null;
        if (isset($_POST['formdata'])) {
            parse_str($_POST['formdata'], $formdata);
        }

        $code = isset($formdata['php-run-once-code-chunk']) ? $formdata['php-run-once-code-chunk'] : false;

        if (!$code) {
            wp_send_json(['status' => 0, 'message' => 'single proccess code is not set']);
            wp_die();
        }

        $code = stripslashes($code);
        $code = preg_replace('/^<\?php(.*)(\?>)?$/s', '$1', $code);
        $output = '';
        ob_start();
        try {
            eval($code);
            dbg('Processing ids... ' . implode(', ', $ids), 0);
            foreach ($ids as $id) {
                dbg(call_user_func('php_run_process_single', $id), 0);
            }
        } catch (Exception $e) {
            echo 'Caught exception: ' .  $e->getMessage(), "\n";
        } catch (ParseError $e) {
            echo 'Parse error: ' .  $e->getMessage(), "\n";
        }

        $output = ob_get_clean();

        wp_send_json(['status' => 1, 'echo' => $output]);

        wp_die();
    }

    public function php_run_once_ajax()
    {
        check_ajax_referer('myajax-nonce', 'nonce_code');

        if (!current_user_can('administrator')) wp_die();

        $ids = null;
        $output = '';
        if (
            isset($_GET['php-run-once-code-init']) && $_GET['php-run-once-code-init'] ||
            isset($_GET['php-run-once-code']) && $_GET['php-run-once-code']
        ) {
            $code = isset($_GET['php-run-once-code-init']) ? stripslashes($_GET['php-run-once-code-init']) : stripslashes($_GET['php-run-once-code']);
            $code = preg_replace('/^<\?php(.*)(\?>)?$/s', '$1', $code);
            ob_start();
            try {
                if (isset($_GET['php-run-once-code-init'])) {
                    eval($code);
                    $ids = call_user_func('php_run_load');
                } else {
                    eval($code);
                }
            } catch (Exception $e) {
                echo 'Caught exception: ' .  $e->getMessage(), "\n";
            } catch (ParseError $e) {
                echo 'Parse error: ' .  $e->getMessage(), "\n";
            }
        }

        $r = [];
        if ($ids) {
            echo 'Initial data:';
            dbg($ids, false);
            $r['ids'] = $ids;
        }
        $output = ob_get_clean();

        $r['echo'] = $output;

        wp_send_json($r);

        wp_die();
    }

    // only if the class has no instance.
    public static function getInstance()
    {
        if (self::$instance == null) {
            self::$instance = new PHP_Run_Once();
        }

        return self::$instance;
    }
}
