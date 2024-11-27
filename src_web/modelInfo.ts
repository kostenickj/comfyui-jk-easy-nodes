// this code is originally from https://github.com/pythongosssss/ComfyUI-Custom-Scripts
// all i did was modify some stuff add a couple of new features

//@ts-nocheck

import { app } from '../../../scripts/app.js';
import { api } from '../../../scripts/api.js';
import { $el } from '../../../scripts/ui.js';
import { ModelInfoDialog } from './common/modelInfoDialog.js';
import { TextAreaAutoComplete } from './common/autocomplete.js';

const MAX_TAGS = 500;
const NsfwLevel = {
    PG: 1,
    PG13: 2,
    R: 4,
    X: 8,
    XXX: 16,
    Blocked: 32
};

export class LoraInfoDialog extends ModelInfoDialog {
    getTagFrequency() {
        if (!this.metadata.ss_tag_frequency) return [];

        const datasets = JSON.parse(this.metadata.ss_tag_frequency);
        const tags = {};
        for (const setName in datasets) {
            const set = datasets[setName];
            for (const t in set) {
                if (t in tags) {
                    tags[t] += set[t];
                } else {
                    tags[t] = set[t];
                }
            }
        }

        return Object.entries(tags).sort((a, b) => b[1] - a[1]);
    }

    getResolutions() {
        let res = [];
        if (this.metadata.ss_bucket_info) {
            const parsed = JSON.parse(this.metadata.ss_bucket_info);
            if (parsed?.buckets) {
                for (const { resolution, count } of Object.values(parsed.buckets)) {
                    res.push([count, `${resolution.join('x')} * ${count}`]);
                }
            }
        }
        res = res.sort((a, b) => b[0] - a[0]).map((a) => a[1]);
        let r = this.metadata.ss_resolution;
        if (r) {
            const s = r.split(',');
            const w = s[0].replace('(', '');
            const h = s[1].replace(')', '');
            res.push(`${w.trim()}x${h.trim()} (Base res)`);
        } else if ((r = this.metadata['modelspec.resolution'])) {
            res.push(r + ' (Base res');
        }
        if (!res.length) {
            res.push('⚠️ Unknown');
        }
        return res;
    }

    getTagList(tags) {
        return tags.map((t) =>
            $el(
                'li.jk-nodes-model-tag',
                {
                    dataset: {
                        tag: t[0]
                    },
                    $: (el) => {
                        el.onclick = () => {
                            el.classList.toggle('jk-nodes-model-tag--selected');
                        };
                    }
                },
                [
                    $el('p', {
                        textContent: t[0]
                    }),
                    $el('span', {
                        textContent: t[1]
                    })
                ]
            )
        );
    }

    addTags() {
        let tags = this.getTagFrequency();
        if (!tags?.length) {
            tags = this.metadata['modelspec.tags']?.split(',').map((t) => [t.trim(), 1]);
        }
        let hasMore;
        if (tags?.length) {
            const c = tags.length;
            let list;
            if (c > MAX_TAGS) {
                tags = tags.slice(0, MAX_TAGS);
                hasMore = $el('p', [
                    $el('span', { textContent: `⚠️ Only showing first ${MAX_TAGS} tags ` }),
                    $el('a', {
                        href: '#',
                        textContent: `Show all ${c}`,
                        onclick: () => {
                            list.replaceChildren(...this.getTagList(this.getTagFrequency()));
                            hasMore.remove();
                        }
                    })
                ]);
            }
            list = $el('ol.jk-nodes-model-tags-list', this.getTagList(tags));
            this.tags = $el('div', [list]);
        } else {
            this.tags = $el('p', { textContent: '⚠️ No tag frequency metadata found' });
        }

        this.content.append(this.tags);

        if (hasMore) {
            this.content.append(hasMore);
        }
    }

    addPreferredWeightAndActivationText(prefs) {
        const prefWeight = prefs?.preferred_weight;
        const prefText = prefs?.activation_text;
        const textArea = $el('textarea', {
            textContent: prefText ?? '',
            style: {
                whiteSpace: 'pre-wrap',
                margin: '10px 0',
                color: '#fff',
                background: '#222',
                padding: '5px',
                borderRadius: '5px',
                maxHeight: '250px',
                overflow: 'auto',
                display: 'block',
                border: 'none',
                width: 'calc(100% - 10px)'
            }
        });

        const weight = $el('input', {
            type: 'number',
            step: '.05',
            value: prefWeight ?? 1.0,
            style: {
                width: '80px'
            },
            onchange: (event) => {
                const value = event.target.value;
            }
        });

        $el(
            'p',
            {
                parent: this.content,
                textContent: `Default Weight: `
            },
            [weight]
        );

        $el(
            'p',
            {
                parent: this.content,
                textContent: `Default Activation Text: `
            },
            [
                textArea,
                $el('button', {
                    onclick: async () => {
                        const weightVal = parseFloat(weight.value);
                        const activationVal = textArea.value;
                        this.saveLoraPrefs(activationVal, weightVal, this.name);
                    },
                    textContent: 'Save Lora Defaults',
                    style: {
                        fontSize: '14px'
                    }
                }),
                $el('hr')
            ]
        );
    }

    addExample(title, value, name) {
        const textArea = $el('textarea', {
            textContent: value,
            style: {
                whiteSpace: 'pre-wrap',
                margin: '10px 0',
                color: '#fff',
                background: '#222',
                padding: '5px',
                borderRadius: '5px',
                maxHeight: '250px',
                overflow: 'auto',
                display: 'block',
                border: 'none',
                width: 'calc(100% - 10px)'
            }
        });
    }

    async addInfo() {
        this.addInfoEntry('Name', this.metadata.ss_output_name || '⚠️ Unknown');
        this.addInfoEntry('Base Model', this.metadata.ss_sd_model_name || '⚠️ Unknown');
        this.addInfoEntry('Clip Skip', this.metadata.ss_clip_skip || '⚠️ Unknown');

        this.addInfoEntry(
            'Resolution',
            $el(
                'select',
                this.getResolutions().map((r) => $el('option', { textContent: r }))
            )
        );

        super.addInfo();
        const p = this.addCivitaiInfo();
        this.addPreferredWeightAndActivationText(this.lora_pref);

        this.addTags();

        const info = await p;
        this.addExample('Trained Words', info?.trainedWords?.join(', ') ?? '', 'trainedwords');

        const triggerPhrase = this.metadata['modelspec.trigger_phrase'];
        if (triggerPhrase) {
            this.addExample('Trigger Phrase', triggerPhrase, 'triggerphrase');
        }

        $el('div', {
            parent: this.content,
            innerHTML: info?.description ?? this.metadata['modelspec.description'] ?? '[No description provided]',
            style: {
                maxHeight: '250px',
                overflow: 'auto'
            }
        });
    }

    async saveLoraPrefs(activation_text, weight, lora_name) {
        try {
            await api.fetchApi('/jk-nodes/lora-preference', {
                method: 'POST',
                body: JSON.stringify({
                    lora_name: lora_name,
                    activation_text: activation_text,
                    preferred_weight: weight
                }),
                headers: {
                    'content-type': 'application/json'
                }
            });

            // refresh tags
            const ext = window?.app?.enabledExtensions?.find((x) => x.name === 'jk-nodes.AutoCompleter');
            if (ext) {
                ext.setup();
            }

            alert('Saved!');
        } catch (error) {
            console.error(error);
            alert('Error saving: ' + error);
        }
    }

    createButtons() {
        const btns = super.createButtons();
        function tagsToCsv(tags) {
            return tags.map((el) => el.dataset.tag).join(', ');
        }
        function copyTags(e, tags) {
            const textarea = $el('textarea', {
                parent: document.body,
                style: {
                    position: 'fixed'
                },
                textContent: tagsToCsv(tags)
            });
            textarea.select();
            try {
                document.execCommand('copy');
                if (!e.target.dataset.text) {
                    e.target.dataset.text = e.target.textContent;
                }
                e.target.textContent = 'Copied ' + tags.length + ' tags';
                setTimeout(() => {
                    e.target.textContent = e.target.dataset.text;
                }, 1000);
            } catch (ex) {
                prompt('Copy to clipboard: Ctrl+C, Enter', text);
            } finally {
                document.body.removeChild(textarea);
            }
        }

        btns.unshift(
            $el('button', {
                type: 'button',
                textContent: 'Copy Selected',
                onclick: (e) => {
                    copyTags(e, [...this.tags.querySelectorAll('.jk-nodes-model-tag--selected')]);
                }
            }),
            $el('button', {
                type: 'button',
                textContent: 'Copy All',
                onclick: (e) => {
                    copyTags(e, [...this.tags.querySelectorAll('.jk-nodes-model-tag')]);
                }
            })
        );

        return btns;
    }
}

const lookups = {};

function addInfoOption(node, type, infoClass, widgetNamePattern, opts) {
    const widgets = widgetNamePattern ? node.widgets.filter((w) => w.name === widgetNamePattern || w.name.match(`^${widgetNamePattern}$`)) : [node.widgets[0]];
    for (const widget of widgets) {
        let value = widget.value;
        if (value?.content) {
            value = value.content;
        }
        if (!value || value === 'None') {
            return;
        }
        let optName;
        const split = value.split(/[.\\/]/);
        optName = split[split.length - 2];
        opts.push({
            content: optName,
            callback: async () => {
                new infoClass(value, node).show(type, value);
            }
        });
    }
}

function addTypeOptions(node, typeName, options) {
    const type = typeName.toLowerCase() + 's';
    const values = lookups[typeName][node.type];
    if (!values) return;

    const widgets = Object.keys(values);

    const opts = [];
    for (const w of widgets) {
        addInfoOption(node, type, LoraInfoDialog, w, opts);
    }

    if (!opts.length) return;

    if (opts.length === 1) {
        opts[0].content = `View ${typeName} info...`;
        options.unshift(opts[0]);
    } else {
        options.unshift({
            title: `View ${typeName} info...`,
            has_submenu: true,
            submenu: {
                options: opts
            }
        });
    }
}
const alreadyRegisted = app.enabledExtensions.find((x) => x.name === 'jk-nodes.ModelInfo');
if (!alreadyRegisted) {
    app.registerExtension({
        name: 'jk-nodes.ModelInfo',
        setup() {
            app.ui.settings.addSetting({
                id: `jk-nodes.ModelInfo.NsfwLevel`,
                name: `Model Info - Image Preview Max NSFW Level`,
                type: 'combo',
                defaultValue: 'PG13',
                options: Object.keys(NsfwLevel),
                tooltip: `Hides preview images that are tagged as a higher NSFW level`,
                onChange(value) {
                    ModelInfoDialog.nsfwLevel = NsfwLevel[value] ?? NsfwLevel.PG;
                }
            });
        },
        beforeRegisterNodeDef(nodeType) {
            const getExtraMenuOptions = nodeType.prototype.getExtraMenuOptions;
            nodeType.prototype.getExtraMenuOptions = function (_, options) {
                if (this.widgets) {
                    for (const type in lookups) {
                        addTypeOptions(this, type, options);
                    }
                }

                return getExtraMenuOptions?.apply(this, arguments);
            };
        }
    });
}
