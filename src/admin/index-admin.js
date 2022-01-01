import './main-admin.scss';
import 'highlight.js/styles/monokai.css';
import saveToStorage from './modules/save';
// import 'highlight.js/styles/paraiso-dark.css';
'use strict';

import hljs from 'highlight.js/lib/core';
import php from 'highlight.js/lib/languages/php';

import { highlightCode, defaultAjax } from './modules/helpers';

(function ($) {
    $(function () {
        hljs.registerLanguage('php', php);
        hljs.highlightAll();

        $('[data-php-code]').each((i, target) => {
            const attribute = target.getAttribute('id');
            let code = null;
            switch (attribute) {
                case 'php-run-once-code-init':
                    code = `<?php \nfunction php_run_load() {\n  // Get initial data (posts ids or whatever)\n  $args = [\n    'post_type' => 'post',\n    'posts_per_page' => 10,\n    'fields' => 'ids'\n  ];\n  return get_posts($args);\n} \n`;
                    break;
                case 'php-run-once-code-chunk':
                    code = '<?php \nfunction php_run_process_single($id) {\n  // Do something with id\n  echo get_the_title($id);\n} \n';
                    break;
                default:
                    code = `<?php \n$example = [1, 2, 3];\n\n// Use this function or echo to show variables:\nvar_dump($example);\necho 'not for array';\n\n// Or this wrapper (for any types):\ndbg($example, 0);\n`;
                    break;
            }
            const el = $(target);
            el.val(code);
            highlightCode(code, el);
        });

        saveToStorage();

        $('[data-php-code]').on('keyup', e => {
            highlightCode(e.target.value, $(e.target));
            syncScroll(e.target);
        });

        $('[data-php-code]').on('scroll', e => syncScroll(e.target));

        defaultAjax('php-run-once', 'php_run_once_ajax', 'GET', phpRunOnceCallback);
        defaultAjax('php-run-once-advanced', 'php_run_once_ajax', 'GET', recurseCallback);
    });

    function syncScroll(target) {
        const editor = $(target).closest('.php-run-once-editor');
        const textarea = editor.find('[data-php-code]').get(0);
        const code = editor.find('code').get(0);
        code.scrollTop = textarea.scrollTop;
    }

    let ids = null;
    let { chunkSize } = { ...phpRun };
    if (typeof chunkSize === 'undefined') {
        chunkSize = 80;
    }

    chunkSize = chunkSize > 800 ? 800 : chunkSize;
    chunkSize = chunkSize < 1 ? 1 : chunkSize;

    let formdata = null;

    function recurseCallback(data) {

        if (typeof data.ids === 'undefined') return;

        ids = [...data.ids];

        $('.php-run-once-log code').html(data.echo);
        const form = $('#php-run-once-advanced');
        formdata = form.serialize();

        form.addClass('loading');
        recurseAjax();
    }

    function recurseAjax() {

        const form = $('#php-run-once-advanced');
        const button = form.find('button[type=submit]');

        const ids_chunk = ids.slice(0, chunkSize);
        ids = ids.slice(chunkSize);

        const data = {
            action: 'php_run_advanced_chunk_ajax',
            ids: ids_chunk,
            formdata,
            nonce_code: php_run_ajax.nonce
        };

        $.post({
            url: php_run_ajax.url,
            data,
            beforeSend: function () {
                button.text(`Executing process code... (${ids.length} left)`);
            },
            success: function (data) {
                button.text('Execute');
                if (data.status) {
                    const codeTag = $('.php-run-once-log code');
                    const codeTagHtml = codeTag.get(0);
                    codeTag.append(data.echo);
                    codeTagHtml.scrollTop = codeTagHtml.scrollHeight;

                    if (ids.length) {
                        recurseAjax();
                    }
                    else {
                        form.removeClass('loading');
                        button.text('Execute');
                    }
                }
                else {
                    alert(data.message);
                }
            },
        });
    }

    function phpRunOnceCallback(data) {
        $('.php-run-once-log code').html(data.echo);
    }

})(jQuery);