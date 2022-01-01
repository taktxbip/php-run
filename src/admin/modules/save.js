import { highlightCode } from './helpers';

function saveToStorage() {
    settings();

    const mode = jQuery('[data-mode]').attr('data-mode');
    if (!mode) return;

    initLoadSelect(mode);
    loadSelect(mode);

    jQuery('[data-action=save]').on('click', e => {

        if (mode !== 'simple' && mode !== 'advanced') return;

        const name = prompt('Set name for script');
        if (!name) return;

        const index = getScriptIndex(`php-run-${mode}-script`, name);
        const overwrite = index !== -1 ? true : false;

        if (overwrite) {
            const status = confirm(`Script "${name}" already exists. Do you want to overwrite it?`);
            if (!status) return;
        }

        const storage = window.localStorage;

        let saved = storage.getItem(`php-run-${mode}-script`);
        let updated = JSON.parse(saved);

        if (updated === null || !updated.length) updated = [];

        const newItem = mode === 'simple' ? {
            name,
            script: jQuery('.php-run-once-page [data-php-code]').val()
        } : {
            name,
            init: jQuery('#php-run-once-code-init').val(),
            chunk: jQuery('#php-run-once-code-chunk').val()
        };

        if (overwrite) {
            updated = [...updated.slice(0, index), newItem, ...updated.slice(index + 1)];
        } else {
            updated.push(newItem);
        }
        storage.setItem(`php-run-${mode}-script`, JSON.stringify(updated));

        alert('Saved');
    });
}

function settings() {
    const settings = jQuery('.php-run-settings');
    if (!settings.length) return;

    initManage();
    manage();
}

function manage() {
    jQuery('.php-run-scripts').on('click', '.remove', e => {
        const current = jQuery(e.target);
        const li = current.closest('li');
        const mode = li.attr('data-mode');
        const name = li.attr('data-name');
        const answer = confirm(`Remove script "${name}"? This action can\'t be undone`);
        if (answer) {
            removeFromStorage(`php-run-${mode}-script`, name);
            li.remove();
        }
    });
}

function removeFromStorage(key, name) {
    const storage = window.localStorage;

    const saved = JSON.parse(storage.getItem(key));
    const index = saved.findIndex(el => el.name === name);
    const updated = [...saved.slice(0, index), ...saved.slice(index + 1)];

    storage.setItem(key, JSON.stringify(updated));
}

function getScriptIndex(key, name) {
    const storage = window.localStorage;
    const saved = JSON.parse(storage.getItem(key));

    if (!saved)
        return -1;

    return saved.findIndex(el => el.name === name);
}


function initManage() {
    const wrap = jQuery('.php-run-scripts');
    const storage = window.localStorage;

    const modes = ['simple', 'advanced'];
    modes.forEach(mode => {
        const scriptsUl = wrap.find(`.${mode}-scripts`);
        let saved = storage.getItem(`php-run-${mode}-script`);

        let html = '';
        if (saved && saved !== '[]') {
            saved = JSON.parse(saved);
            html = '<ul>';
            saved.forEach(({ name }) => html += `<li data-mode="${mode}" data-name="${name}">${name} <span class="remove">Remove</span></li>`);
            html += '</ul>';
        }
        else {
            html = '<p class="decription">No scripts found</p>';
        }
        scriptsUl.html(html);
    });
}

function initLoadSelect(mode) {
    if (mode !== 'simple' && mode !== 'advanced') return;

    const storage = window.localStorage;
    const select = jQuery('#load-script');

    let saved = storage.getItem(`php-run-${mode}-script`);
    saved = JSON.parse(saved);

    if (saved === null || !saved.length) return;

    let html = '';
    saved.forEach(({ name }) => html += `<option value="${name}">${name}</option>`);
    select.append(html);
}

function loadSelect(mode) {
    jQuery('[data-action=load] button').on('click', function () {
        const select = jQuery('#load-script');
        const val = select.val();

        const storage = window.localStorage;

        if (val === '-') return;

        let saved = storage.getItem(`php-run-${mode}-script`);
        saved = JSON.parse(saved);
        const current = saved.filter(el => el.name == val);

        if (!current.length) return;

        if (mode === 'simple') {
            const textarea = jQuery('[data-php-code]');
            textarea.val(current[0].script);
            highlightCode(current[0].script, textarea);
        }
        else if (mode === 'advanced') {
            const textareaInit = jQuery('#php-run-once-code-init');
            textareaInit.val(current[0].init);
            highlightCode(current[0].init, textareaInit);

            const textareaChunk = jQuery('#php-run-once-code-chunk');
            textareaChunk.val(current[0].chunk);
            highlightCode(current[0].chunk, textareaChunk);
        }
    });
}

export default saveToStorage;