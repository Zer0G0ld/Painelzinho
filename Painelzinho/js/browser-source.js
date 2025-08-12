// =======================
// 1. Funções Utilitárias - INÍCIO
// =======================

//Verifique a visualização
function getUrlParameter(sParam) {
	const params = new URLSearchParams(window.location.search);
	if (!params.has(sParam)) return undefined;

	const value = params.get(sParam);
	return value === null ? true : value;
}
// =======================
// 1. Funções Utilitárias - FIM
// =======================


// =======================
// 2. Configuração Inicial e Variáveis Globais - INÍCIO
// =======================
// Obtem o parâmetro 'mode' e transforma em string para evitar bugs
const mode = String(getUrlParameter('mode') || '').toLowerCase();

if (mode === 'preview') {
	document.body.classList.add('preview');
}

// BroadcastChannels para comunicação
const channels = {
	receiver: new BroadcastChannel('obs-lower-thirds-channel'),
	sender: new BroadcastChannel('obs-lower-thirds-channel2'),
	fonts: new BroadcastChannel('obs-lower-thirds-fonts'),
};

// Estrutura para armazenar estados por "alt"
const alts = {
	alt1: {
		logoImageOld: undefined,
		alignOld: 'left',
		styleOld: undefined,
		canIn: false,
		count: 0,
		dValue: 0,
		timeout: undefined,
		sValue: undefined,
		activeIsOn: 0,
		inactiveIsOn: 0,
		turnoff: undefined,
	},
	alt2: {
		logoImageOld: undefined,
		alignOld: 'left',
		styleOld: undefined,
		canIn: false,
		count: 0,
		dValue: 0,
		timeout: undefined,
		sValue: undefined,
		activeIsOn: 0,
		inactiveIsOn: 0,
		turnoff: undefined,
	},
	alt3: {
		logoImageOld: undefined,
		alignOld: 'left',
		styleOld: undefined,
		canIn: false,
		count: 0,
		dValue: 0,
		timeout: undefined,
		sValue: undefined,
		activeIsOn: 0,
		inactiveIsOn: 0,
		turnoff: undefined,
	},
	alt4: {
		logoImageOld: undefined,
		alignOld: 'left',
		styleOld: undefined,
		canIn: false,
		count: 0,
		dValue: 0,
		timeout: undefined,
		sValue: undefined,
		activeIsOn: 0,
		inactiveIsOn: 0,
		turnoff: undefined,
	},
};
// =======================
// 2. Configuração Inicial e Variáveis Globais - FIM
// =======================


// =======================
// 3. Funções de Animação - INÍCIO
// =======================

function animationIn(id) {
	const el = document.getElementById(id);
	if (!el) return; // Proteção caso o elemento não exista

	el.classList.remove("animation-out");
	// Forçar reflow para reiniciar a animação
	void el.offsetWidth;
	el.classList.add("animation-in");
}

function animationOut(id) {
	const el = document.getElementById(id);
	if (!el) return;

	el.classList.remove("animation-in");
	void el.offsetWidth;
	el.classList.add("animation-out");
}


// =======================
// 3. Funções de Animação - FIM
// =======================


// =======================
// 4. Controle de Tempo dos Lower Thirds - INÍCIO
// =======================
// Estado geral dos lower-thirds
const lowerThirds = {
	"lower-third-1": { c: 0, d: 0, t: null, s: null, activeIsOn: false, inactiveIsOn: false, turnoff: false, oneshot: alt_1_oneshot, activeTime: alt_1_active_time, inactiveTime: alt_1_inactive_time },
	"lower-third-2": { c: 0, d: 0, t: null, s: null, activeIsOn: false, inactiveIsOn: false, turnoff: false, oneshot: alt_2_oneshot, activeTime: alt_2_active_time, inactiveTime: alt_2_inactive_time },
	"lower-third-3": { c: 0, d: 0, t: null, s: null, activeIsOn: false, inactiveIsOn: false, turnoff: false, oneshot: alt_3_oneshot, activeTime: alt_3_active_time, inactiveTime: alt_3_inactive_time },
	"lower-third-4": { c: 0, d: 0, t: null, s: null, activeIsOn: false, inactiveIsOn: false, turnoff: false, oneshot: alt_4_oneshot, activeTime: alt_4_active_time, inactiveTime: alt_4_inactive_time },
};

function activeCount(id) {
	const lt = lowerThirds[id];
	if (!lt) return;

	if (lt.c <= lt.activeTime) {
		lt.c++;
		lt.t = setTimeout(() => activeCount(id), 1000);
	} else {
		stopTimeCount(id);
		startInactiveCount(id);
	}
}

function inactiveCount(id) {
	const lt = lowerThirds[id];
	if (!lt) return;

	if (lt.d <= lt.inactiveTime) {
		lt.d++;
		lt.s = setTimeout(() => inactiveCount(id), 1000);
	} else {
		startActiveCount(id);
		lt.d = 0;
		clearTimeout(lt.s);
		lt.inactiveIsOn = false;
	}
}

function startActiveCount(id) {
	const lt = lowerThirds[id];
	if (!lt || lt.activeIsOn) return;

	lt.activeIsOn = true;
	activeCount(id);
	animationIn(id);
}

function startInactiveCount(id) {
	const lt = lowerThirds[id];
	if (!lt || lt.inactiveIsOn) return;

	lt.inactiveIsOn = true;
	if (!lt.oneshot) {
		inactiveCount(id);
	} else {
		lt.turnoff = true;
	}
	animationOut(id);
}

function stopTimeCount(id) {
	const lt = lowerThirds[id];
	if (!lt) return;

	lt.c = 0;
	lt.d = 0;
	lt.activeIsOn = false;
	lt.inactiveIsOn = false;
	clearTimeout(lt.s);
	clearTimeout(lt.t);

	animationOut(id);
}

// =======================
// 4. Controle de Tempo dos Lower Thirds - FIM
// =======================


// =======================
// 5. Manipulação de Logos - INÍCIO
// =======================
function changeLogoVisibility(...args) {
	// args vem na ordem: alt_1_logo_switch, alt_1_logo_image, alt_2_logo_switch, alt_2_logo_image, ...
	for (let i = 0; i < 4; i++) {
		const logoSwitch = args[i * 2];
		const logoImage = args[i * 2 + 1];
		const logoId = `alt-${i + 1}-logo`;
		const logoImgId = `alt-${i + 1}-logo-image`;

		if (logoSwitch === "true") {
			$(`#${logoId}`).removeClass("no-logo");
			loadLogo(logoImgId, logoImage);
		} else {
			$(`#${logoId}`).addClass("no-logo");
			loadLogo(logoImgId);
		}
	}
}

function loadLogo(alt, logo) {
	if (logo) {
		$(`#${alt}`).attr("src", logo);
	} else {
		$(`#${alt}`).attr("src", "//:0");
	}
}

// =======================
// 5. Manipulação de Logos - FIM
// =======================


// =======================
// 6. Recepção de Dados dos Canais - INÍCIO
// =======================

const align_old = {};
const style_old = {};
const logo_image_old = {};
const canIn = { 1: false, 2: false, 3: false, 4: false };

bcp.onmessage = (ev) => {
	const received_data = ev.data;
	const { global_animation_time, global_oneshot } = received_data;
	const alts = [1, 2, 3, 4];
	const root = document.documentElement;

	const activeTime = mode !== "preview" ? received_data.global_active_time : Infinity;
	const inactiveTime = received_data.global_inactive_time;

	const getValue = (key) => received_data[key];

	const updateText = (id, text) => {
		const el = document.getElementById(id);
		if (el) el.innerHTML = text;
	};

	const processAlt = (i) => {
		const prefix = `alt_${i}_`;
		const name = getValue(prefix + 'name') || "";
		const info = getValue(prefix + 'info') || "";
		let background_switch = getValue(prefix + 'background_switch');
		let style_color_1 = getValue(prefix + 'style_color_1');
		let style_color_2 = getValue(prefix + 'style_color_2');
		let line_spacing = (getValue(prefix + 'line_spacing') || 0) * 0.1;
		let border_thickness_amount = (getValue(prefix + 'border_thickness_amount') || 0) * 0.1;
		const border_switch = getValue(prefix + 'border_switch');
		let style_color_3 = getValue(prefix + 'style_color_3');
		let style_color_4 = getValue(prefix + 'style_color_4');
		const logo_switch = getValue(prefix + 'logo_switch');
		const logo_image = getValue(prefix + 'logo_image') || `../logos/logo_${i}.png`;
		const align = getValue(prefix + 'align') || "left";
		const style = getValue(prefix + 'style');
		let switch_val = getValue(prefix + 'switch');
		const preview = getValue(prefix + 'preview');
		const shadows = getValue(prefix + 'shadows');
		const shadow_amount = getValue(prefix + 'shadow_amount');
		const background_switch_str = background_switch;

		let animation_time = Number(getValue(prefix + 'animation_time') || global_animation_time);
		let active_time = Number(getValue(prefix + 'active_time') || activeTime);
		let inactive_time = Number(getValue(prefix + 'inactive_time') || inactiveTime);

		const oneshot = getValue(prefix + 'oneshot') || (global_oneshot && !getValue(prefix + 'inactive_time'));

		updateText(`alt-${i}-name`, name);
		updateText(`alt-${i}-info`, info);

		if (background_switch === "false") {
			style_color_1 = "none";
			style_color_2 = "none";
		}
		if (border_switch === "false") {
			style_color_3 = "none";
			style_color_4 = "none";
			border_thickness_amount = 0;
		}

		active_time = Math.max(active_time, animation_time);
		inactive_time = Math.max(inactive_time, animation_time);

		if (mode === "preview") {
			active_time = Infinity;
			switch_val = preview;
		}

		const lowerThirdId = `lower-third-${i}`;
		const el = document.getElementById(lowerThirdId);

		if (switch_val === "false" || !name.length || !info.length) {
			if (canIn[i]) {
				canIn[i] = false;
				stopTimeCount(lowerThirdId);
			} else {
				stopTimeCount(lowerThirdId);
			}
		} else {
			if (!canIn[i]) {
				canIn[i] = true;
				if (el) el.classList.remove("hide-anim");
				startActiveCount(lowerThirdId);
			}
		}

		if (align !== align_old[i]) {
			if (switch_val === "false" && el) el.classList.add("hide-anim");
			if (el) ["left", "center", "right"].forEach(cls => el.classList.replace(cls, align));
			align_old[i] = align;
		}

		if (style !== style_old[i]) {
			if (switch_val === "false" && el) el.classList.add("hide-anim");
			if (el) ["style-1", "style-2", "style-3"].forEach(cls => el.classList.replace(cls, `style-${style}`));
			style_old[i] = style;
		}

		if (logo_image !== logo_image_old[i]) {
			loadLogo(`alt-${i}-logo-image`, logo_image);
			logo_image_old[i] = logo_image;
		}

		return {
			animation_time,
			active_time,
			inactive_time,
			oneshot,
			logo_switch,
			logo_image,
			style_color_1,
			style_color_2,
			style_color_3,
			style_color_4,
			line_spacing,
			border_thickness_amount,
			switch_val,
			shadows,
			shadow_amount,
			background_switch: background_switch_str,
			name_size: getValue(prefix + 'name_size'),
			info_size: getValue(prefix + 'info_size'),
			name_transform: getValue(prefix + 'name_transform'),
			info_transform: getValue(prefix + 'info_transform'),
			name_weight: getValue(prefix + 'name_weight'),
			info_weight: getValue(prefix + 'info_weight'),
			name_color: getValue(prefix + 'name_color'),
			info_color: getValue(prefix + 'info_color'),
			font: getValue(prefix + 'font'),
			logo_size: getValue(prefix + 'logo_size'),
			corners: getValue(prefix + 'corners'),
			border_switch,
			border_thickness_amount,
			size: getValue(prefix + 'size'),
			margin_h: getValue(prefix + 'margin_h'),
			margin_v: getValue(prefix + 'margin_v'),
		};
	};

	const altSettings = {};
	alts.forEach(i => {
		altSettings[i] = processAlt(i);
	});

	changeLogoVisibility(
		altSettings[1].logo_switch, altSettings[1].logo_image,
		altSettings[2].logo_switch, altSettings[2].logo_image,
		altSettings[3].logo_switch, altSettings[3].logo_image,
		altSettings[4].logo_switch, altSettings[4].logo_image
	);

	const properties = [
		'size',
		'margin_h',
		'margin_v',
		'line_spacing',
		'name_size',
		'info_size',
		'name_transform',
		'info_transform',
		'name_weight',
		'info_weight',
		'name_color',
		'info_color',
		'style_color_1',
		'style_color_2',
		'style_color_3',
		'style_color_4',
		'font',
		'logo_size',
		'corners',
		'border_switch',
		'border_thickness_amount',
		'animation_time',
	];

	alts.forEach(i => {
		const prefix = `alt-${i}`;
		const alt = altSettings[i];

		root.style.setProperty(`--${prefix}-animation-time`, alt.animation_time + "s");

		properties.forEach(prop => {
			const value = alt[prop];
			if (value === undefined || value === null) return;

			let cssValue;

			if (prop === 'size') {
				cssValue = value + "px";
			} else if (prop.includes('margin') || prop.includes('border_thickness_amount')) {
				cssValue = value + "rem";
			} else if (
				prop.includes('line_spacing') ||
				prop.includes('name_size') ||
				prop.includes('info_size') ||
				prop.includes('logo_size') ||
				prop.includes('corners')
			) {
				cssValue = value + "em";
			} else if (prop === 'animation_time') {
				cssValue = value + "s";
			} else {
				cssValue = value;
			}

			root.style.setProperty(`--${prefix}-${prop.replace(/_/g, '-')}`, cssValue);
		});
	});

	alts.forEach(i => {
		const alt = altSettings[i];
		const prefix = `--alt-${i}`;

		const bgZero = alt.style_color_2 && alt.style_color_2.match(/,0\)$/) ? "0" : "1";
		root.style.setProperty(`${prefix}-background`, bgZero);

		if (alt.shadows === "false") {
			root.style.setProperty(`${prefix}-shadows`, "none");
			root.style.setProperty(`${prefix}-shadows-graph`, "none");
		} else if (alt.shadows === "true") {
			const shadowVal = `0.1rem 0.1rem 0.2rem rgba(0,0,0,${alt.shadow_amount})`;
			root.style.setProperty(`${prefix}-shadows`, shadowVal);
			root.style.setProperty(
				`${prefix}-shadows-graph`,
				alt.background_switch === "false" ? "none" : shadowVal
			);
		}
	});
};


// =======================
// Recepção de fonte dinâmica - INÍCIO
// =======================

bcf.onmessage = (ev) => {
	const received_data = ev.data;
	const new_font = received_data.new_font_to_send;

	let styleTag = document.getElementById('dynamic-font-style');
	if (!styleTag) {
		styleTag = document.createElement('style');
		styleTag.id = 'dynamic-font-style';
		document.head.appendChild(styleTag);
	}

	styleTag.textContent = new_font;
};

// =======================
// Recepção de fonte dinâmica - FIM
// =======================



// =======================
// 7. Atualização de Estilos e Propriedades CSS - INÍCIO
// =======================

// Esta parte está dentro do bcp.onmessage, onde são atualizadas as propriedades CSS dinamicamente
// ...existing code...

// =======================
// 7. Atualização de Estilos e Propriedades CSS - FIM
// =======================


// =======================
// 8. Envio de Dados para o Painel de Controle - INÍCIO
// =======================

function function_send() {
	// Array dos pares [c, d] para cada alt
	const times = [
		[c1, d1],
		[c2, d2],
		[c3, d3],
		[c4, d4]
	];

	// Função para ajustar o tempo (subtrai 1 e não deixa negativo)
	function ajustaTempo(t) {
		return t - 1 < 0 ? 0 : t - 1;
	}

	// Montar objeto com as propriedades para enviar
	const dataToSend = {};

	times.forEach(([c, d], i) => {
		const index = i + 1;
		dataToSend[`activeTime${index}_to_send`] = ajustaTempo(c);
		dataToSend[`inactiveTime${index}_to_send`] = ajustaTempo(d);
	});

	// Incluir os turnoffs
	dataToSend.alt_1_turnoff = alt_1_turnoff;
	dataToSend.alt_2_turnoff = alt_2_turnoff;
	dataToSend.alt_3_turnoff = alt_3_turnoff;
	dataToSend.alt_4_turnoff = alt_4_turnoff;

	// Enviar os dados
	bcr.postMessage(dataToSend);

	// Resetar os turnoffs
	alt_1_turnoff = false;
	alt_2_turnoff = false;
	alt_3_turnoff = false;
	alt_4_turnoff = false;
}

function refreshData() {
	if (mode != "preview") {
		function_send();
	}
}


// =======================
// 8. Envio de Dados para o Painel de Controle - FIM
// =======================


// =======================
// 9. Loop de Atualização - INÍCIO
// =======================

const updateIntervalSeconds = 1; // intervalo em segundos
const updateIntervalMs = updateIntervalSeconds * 1000;

setInterval(refreshData, updateIntervalMs);
bcr.postMessage({ resend: true });
// =======================
// 9. Loop de Atualização - FIM
// =======================

// =======================
// 10. Finalização e Limpeza - INÍCIO
// =======================

// Limpa os intervalos e canais ao finalizar.
function cleanup() {
	clearInterval(updateInterval);
	bc.close();
	bcr.close();
	bcf.close();
}

// Chama a função de limpeza ao descarregar a página.
window.addEventListener('beforeunload', cleanup);

// =======================
// 10. Finalização e Limpeza - FIM
// =======================
// Fim do arquivo browser-source.js