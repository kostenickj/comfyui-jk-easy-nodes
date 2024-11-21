// this code is originally from https://github.com/pythongosssss/ComfyUI-Custom-Scripts
// all i did was modify some stuff add a couple of new features

//@ts-nocheck

import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";
import { api } from "../../../scripts/api.js";
import { $el } from "../../../scripts/ui.js";
import { TextAreaAutoComplete } from "./common/autocomplete.js";
import { ModelInfoDialog } from "./common/modelInfoDialog.js";
import { LoraInfoDialog } from "./modelInfo.js";


export const loadLoras = async () => {
	const loras = await api.fetchApi("/jk-nodes/loras", { cache: "no-store" }).then((res) => res.json());

	const words = {};
	words["lora:"] = { text: "lora:" };

	for (const lora of loras) {
		let v = `<lora:${lora.lora_name}:${lora.preferred_weight}>`;
		words[v] = {
			text: v,
			info: () => new LoraInfoDialog(lora).show("loras", lora),
			use_replacer: false,
			activation_text: lora.activation_text
		};
	}

	TextAreaAutoComplete.updateWords("jk-nodes.loras", words);
};

function parseCSV(csvText) {
	const rows = [];
	const delimiter = ",";
	const quote = '"';
	let currentField = "";
	let inQuotedField = false;

	function pushField() {
		rows[rows.length - 1].push(currentField);
		currentField = "";
		inQuotedField = false;
	}

	rows.push([]); // Initialize the first row

	for (let i = 0; i < csvText.length; i++) {
		const char = csvText[i];
		const nextChar = csvText[i + 1];

		// Special handling for backslash escaped quotes
		if (char === "\\" && nextChar === quote) {
			currentField += quote;
			i++;
		}

		if (!inQuotedField) {
			if (char === quote) {
				inQuotedField = true;
			} else if (char === delimiter) {
				pushField();
			} else if (char === "\r" || char === "\n" || i === csvText.length - 1) {
				pushField();
				if (nextChar === "\n") {
					i++; // Handle Windows line endings (\r\n)
				}
				rows.push([]); // Start a new row
			} else {
				currentField += char;
			}
		} else {
			if (char === quote && nextChar === quote) {
				currentField += quote;
				i++; // Skip the next quote
			} else if (char === quote) {
				inQuotedField = false;
			} else if (char === "\r" || char === "\n" || i === csvText.length - 1) {
				// Dont allow new lines in quoted text, assume its wrong
				const parsed = parseCSV(currentField);
				rows.pop();
				rows.push(...parsed);
				inQuotedField = false;
				currentField = "";
				rows.push([]);
			} else {
				currentField += char;
			}
		}
	}

	if (currentField || csvText[csvText.length - 1] === ",") {
		pushField();
	}

	// Remove the last row if it's empty
	if (rows[rows.length - 1].length === 0) {
		rows.pop();
	}

	return rows;
}

async function getCustomWordsFiles() {
	const resp = await api.fetchApi("/jk-nodes/autocomplete-files", { cache: "no-store" });
	if (resp.status === 200) {
		return await resp.json();
	}
	return undefined;
}

async function loadTags() {

	const tagfiles = await getCustomWordsFiles();

	if (tagfiles && Array.isArray(tagfiles)) {
		tagfiles.forEach(t => {
			TextAreaAutoComplete.updateWords(
				`jk-nodes.customwords.${t.file_name}`,
				parseCSV(t.contents).reduce((p, n) => {
					let text;
					let priority;
					let value;
					let num;
					switch (n.length) {
						case 0:
							return;
						case 1:
							// Single word
							text = n[0];
							break;
						case 2:
							// Word,[priority|alias]
							num = +n[1];
							if (isNaN(num)) {
								text = n[0] + "🔄️" + n[1];
								value = n[0];
							} else {
								text = n[0];
								priority = num;
							}
							break;
						case 4:
							// a1111 csv format?
							value = n[0];
							priority = +n[2];
							const aliases = n[3]?.trim();
							if (aliases && aliases !== "null") { // Weird null in an example csv, maybe they are JSON.parsing the last column?
								const split = aliases.split(",");
								for (const text of split) {
									p[text] = { text, priority, value };
								}
							}
							text = value;
							break;
						default:
							// Word,alias,priority
							text = n[1];
							value = n[0];
							priority = +n[2];
							break;
					}
					p[text] = { text, priority, value };
					return p;
				}, {})
			);
		})

	}
}

function toggleLoras() {
	[TextAreaAutoComplete.globalWords, TextAreaAutoComplete.globalWordsExclLoras] = [
		TextAreaAutoComplete.globalWordsExclLoras,
		TextAreaAutoComplete.globalWords,
	];
}

class EmbeddingInfoDialog extends ModelInfoDialog {
	async addInfo() {
		super.addInfo();
		const info = await this.addCivitaiInfo();
		if (info) {
			$el("div", {
				parent: this.content,
				innerHTML: info.description,
				style: {
					maxHeight: "250px",
					overflow: "auto",
				},
			});
		}
	}
}

const ext_id = "jk-nodes.AutoCompleter";

app.registerExtension({
	name: ext_id,
	init() {
		const STRING = ComfyWidgets.STRING;
		const SKIP_WIDGETS = new Set(["ttN xyPlot.x_values", "ttN xyPlot.y_values"]);
		ComfyWidgets.STRING = function (node, inputName, inputData) {
			const r = STRING.apply(this, arguments);

			if (inputData[1]?.multiline) {
				// Disabled on this input
				const config = inputData[1]?.["jk-nodes.autocomplete"];
				if (config === false) return r;

				// In list of widgets to skip
				const id = `${node.comfyClass}.${inputName}`;
				if (SKIP_WIDGETS.has(id)) return r;

				let words;
				let separator;
				if (typeof config === "object") {
					separator = config.separator;
					words = {};
					if (config.words) {
						// Custom wordlist, this will have been registered on setup
						Object.assign(words, TextAreaAutoComplete.groups[node.comfyClass + "." + inputName] ?? {});
					}

					for (const item of config.groups ?? []) {
						if (item === "*") {
							// This widget wants all global words included
							Object.assign(words, TextAreaAutoComplete.globalWords);
						} else {
							// This widget wants a specific group included
							Object.assign(words, TextAreaAutoComplete.groups[item] ?? {});
						}
					}
				}

				new TextAreaAutoComplete(r.widget.inputEl, words, separator);
			}

			return r;
		};

		TextAreaAutoComplete.globalSeparator = localStorage.getItem(ext_id + ".AutoSeparate") ?? ", ";
		const enabledSetting = app.ui.settings.addSetting({
			id: ext_id,
			name: "JK Nodes Text Autocomplete",
			defaultValue: true,
			type: (name, setter, value) => {
				return $el("tr", [
					$el("td", [
						$el("label", {
							for: ext_id.replaceAll(".", "-"),
							textContent: name,
						}),
					]),
					$el("td", [
						$el(
							"label",
							{
								textContent: "Enabled ",
								style: {
									display: "block",
								},
							},
							[
								$el("input", {
									id: ext_id.replaceAll(".", "-"),
									type: "checkbox",
									checked: value,
									onchange: (event) => {
										const checked = !!event.target.checked;
										TextAreaAutoComplete.enabled = checked;
										setter(checked);
									},
								}),
							]
						),
						$el(
							"label",
							{
								textContent: "Auto-insert comma ",
								style: {
									display: "block",
								},
							},
							[
								$el("input", {
									type: "checkbox",
									checked: !!TextAreaAutoComplete.globalSeparator,
									onchange: (event) => {
										const checked = !!event.target.checked;
										TextAreaAutoComplete.globalSeparator = checked ? ", " : "";
										localStorage.setItem(ext_id + ".AutoSeparate", TextAreaAutoComplete.globalSeparator);
									},
								}),
							]
						),
						$el(
							"label",
							{
								textContent: "Replace _ with space ",
								style: {
									display: "block",
								},
							},
							[
								$el("input", {
									type: "checkbox",
									checked: !!TextAreaAutoComplete.replacer,
									onchange: (event) => {
										const checked = !!event.target.checked;
										TextAreaAutoComplete.replacer = checked ? (v) => v.replaceAll("_", " ") : undefined;
										localStorage.setItem(ext_id + ".ReplaceUnderscore", checked);
									},
								}),
							]
						),
						$el(
							"label",
							{
								textContent: "Insert suggestion on: ",
								style: {
									display: "block",
								},
							},
							[
								$el(
									"label",
									{
										textContent: "Tab",
										style: {
											display: "block",
											marginLeft: "20px",
										},
									},
									[
										$el("input", {
											type: "checkbox",
											checked: !!TextAreaAutoComplete.insertOnTab,
											onchange: (event) => {
												const checked = !!event.target.checked;
												TextAreaAutoComplete.insertOnTab = checked;
												localStorage.setItem(ext_id + ".InsertOnTab", checked);
											},
										}),
									]
								),
								$el(
									"label",
									{
										textContent: "Enter",
										style: {
											display: "block",
											marginLeft: "20px",
										},
									},
									[
										$el("input", {
											type: "checkbox",
											checked: !!TextAreaAutoComplete.insertOnEnter,
											onchange: (event) => {
												const checked = !!event.target.checked;
												TextAreaAutoComplete.insertOnEnter = checked;
												localStorage.setItem(ext_id + ".InsertOnEnter", checked);
											},
										}),
									]
								),
							]
						),
						$el(
							"label",
							{
								textContent: "Max suggestions: ",
								style: {
									display: "block",
								},
							},
							[
								$el("input", {
									type: "number",
									value: +TextAreaAutoComplete.suggestionCount,
									style: {
										width: "80px"
									},
									onchange: (event) => {
										const value = +event.target.value;
										TextAreaAutoComplete.suggestionCount = value;;
										localStorage.setItem(ext_id + ".SuggestionCount", TextAreaAutoComplete.suggestionCount);
									},
								}),
							]
						),
					]),
				]);
			},
		});

		TextAreaAutoComplete.enabled = enabledSetting.value;
		TextAreaAutoComplete.replacer = localStorage.getItem(ext_id + ".ReplaceUnderscore") === "true" ? (v) => v.replaceAll("_", " ") : undefined;
		TextAreaAutoComplete.insertOnTab = localStorage.getItem(ext_id + ".InsertOnTab") !== "false";
		TextAreaAutoComplete.insertOnEnter = localStorage.getItem(ext_id + ".InsertOnEnter") !== "false";
		TextAreaAutoComplete.lorasEnabled = true;
		TextAreaAutoComplete.suggestionCount = +localStorage.getItem(ext_id + ".SuggestionCount") || 20;
	},


	setup: () => {
		async function addEmbeddings() {
			const embeddings = await api.getEmbeddings();
			const words = {};
			words["embedding:"] = { text: "embedding:" };

			for (const emb of embeddings) {
				const v = `embedding:${emb}`;
				const split = emb.includes('\\') ? emb.split('\\') : emb.split('/');
				words[v] = {
					text: `embedding:${split[split.length - 1]}`,
					info: () => new EmbeddingInfoDialog(emb).show("embeddings", emb),
					use_replacer: false,
				};
			}

			TextAreaAutoComplete.updateWords("jk-nodes.embeddings", words);
		}

		async function addWildcards()
		{
			/** @type Array<string> */
			const wildcards = await api.fetchApi("/jk-nodes/wildcards", { cache: "no-store" }).then((res) => res.json());
			const words = {};

			for (const w of wildcards) {
				const v = `__${w.replace('.txt','')}__`;
				words[v] = {
					text: v,
					use_replacer: false,
				};
			}

			TextAreaAutoComplete.updateWords("jk-nodes.wildcards", words);

			return Promise.resolve();
		}

		// store global words with/without loras
		Promise.all([addEmbeddings(), loadTags(), addWildcards()])
			.then(() => {
				TextAreaAutoComplete.globalWordsExclLoras = Object.assign({}, TextAreaAutoComplete.globalWords);
			})
			.then(loadLoras)
			.then(() => {
				if (!TextAreaAutoComplete.lorasEnabled) {
					toggleLoras(); // off by default
				}
			});
	},
	beforeRegisterNodeDef(_, def) {
		// Process each input to see if there is a custom word list for
		// { input: { required: { something: ["STRING", { "jk-nodes.autocomplete": ["groupid", ["custom", "words"] ] }] } } }
		const inputs = { ...def.input?.required, ...def.input?.optional };
		for (const input in inputs) {
			const config = inputs[input][1]?.["jk-nodes.autocomplete"];
			if (!config) continue;
			if (typeof config === "object" && config.words) {
				const words = {};
				for (const text of config.words || []) {
					const obj = typeof text === "string" ? { text } : text;
					words[obj.text] = obj;
				}
				TextAreaAutoComplete.updateWords(def.name + "." + input, words, false);
			}
		}
	},
});
