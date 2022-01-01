import hljs from 'highlight.js/lib/core';

function highlightCode(value, el) {
    const codeTag = el.closest('.php-run-once-editor').find('code');
    const highlightedCode = hljs.highlight(value, { language: 'php' }).value;
    codeTag.html(highlightedCode + '\n');
}

function defaultAjax(formID, action, type, callback) {
    const form = jQuery('#' + formID);

    form.on('submit', function (e) {
        e.preventDefault();

        if (form.hasClass('loading')) return;
        form.addClass('loading');

        const button = form.find('button[type="submit"]');
        const formdata = form.serialize() + '&action=' + action + '&nonce_code=' + php_run_ajax.nonce;

        jQuery.ajax({
            url: php_run_ajax.url,
            data: formdata,
            type: type,
            beforeSend: function () {
                button.text('Executing...');
            },
            success: function (response) {
                form.removeClass('loading');
                button.text('Execute');
                callback(response);
            },
        });
    });
}

export {
    highlightCode,
    defaultAjax
};