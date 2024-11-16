import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";
import { api } from "../../../scripts/api.js";
import { $el, ComfyDialog } from "../../../scripts/ui.js";
import { TextAreaAutoComplete } from "./common/autocomplete.js";
import { ModelInfoDialog } from "./common/modelInfoDialog.js";
import { LoraInfoDialog } from "./modelInfo.js";

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

async function getCustomWords() {
	const resp = await api.fetchApi("/jk-nodes/autocomplete", { cache: "no-store" });
	if (resp.status === 200) {
		return await resp.text();
	}
	return undefined;
}

async function addCustomWords(text) {
	if (!text) {
		text = await getCustomWords();
	}
	if (text) {
		TextAreaAutoComplete.updateWords(
			"jk-nodes.customwords",
			parseCSV(text).reduce((p, n) => {
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

class CustomWordsDialog extends ComfyDialog {
	async show() {
		const text = await getCustomWords();
		this.words = $el("textarea", {
			textContent: text,
			style: {
				width: "70vw",
				height: "70vh",
			},
		});

		const input = $el("input", {
			style: {
				flex: "auto",
			},
			value:
				"https://gist.githubusercontent.com/pythongosssss/1d3efa6050356a08cea975183088159a/raw/a18fb2f94f9156cf4476b0c24a09544d6c0baec6/danbooru-tags.txt",
		});

		super.show(
			$el(
				"div",
				{
					style: {
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
						maxHeight: "100%",
					},
				},
				[
					$el("h2", {
						textContent: "Custom Autocomplete Words",
						style: {
							color: "#fff",
							marginTop: 0,
							textAlign: "center",
							fontFamily: "sans-serif",
						},
					}),
					$el(
						"div",
						{
							style: {
								color: "#fff",
								fontFamily: "sans-serif",
								display: "flex",
								alignItems: "center",
								gap: "5px",
							},
						},
						[
							$el("label", { textContent: "Load Custom List: " }),
							input,
							$el("button", {
								textContent: "Load",
								onclick: async () => {
									try {
										const res = await fetch(input.value);
										if (res.status !== 200) {
											throw new Error("Error loading: " + res.status + " " + res.statusText);
										}
										this.words.value = await res.text();
									} catch (error) {
										alert("Error loading custom list, try manually copy + pasting the list");
									}
								},
							}),
						]
					),
					this.words,
				]
			)
		);
	}

	createButtons() {
		const btns = super.createButtons();
		const save = $el("button", {
			type: "button",
			textContent: "Save",
			onclick: async (e) => {
				try {
					const res = await api.fetchApi("/jk-nodes/autocomplete", { method: "POST", body: this.words.value });
					if (res.status !== 200) {
						throw new Error("Error saving: " + res.status + " " + res.statusText);
					}
					save.textContent = "Saved!";
					addCustomWords(this.words.value);
					setTimeout(() => {
						save.textContent = "Save";
					}, 500);
				} catch (error) {
					alert("Error saving word list!");
					console.error(error);
				}
			},
		});

		btns.unshift(save);
		return btns;
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
	setup() {
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

		async function addLoras() {

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
		}
		// store global words with/without loras
		Promise.all([addEmbeddings(), addCustomWords()])
			.then(() => {
				TextAreaAutoComplete.globalWordsExclLoras = Object.assign({}, TextAreaAutoComplete.globalWords);
			})
			.then(addLoras)
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
