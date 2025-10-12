import {
	applySpell,
	applyTheme,
	copySmart,
	createClickHandler,
	createElement,
	downloadText,
	openFileText,
	applySyncedScroll,
} from './utils.js'

// Button factory - more functional approach
const createButton = (config, showToast) => {
	const [id, label, icon, handler, isToggle, pressedDefault] = config

	const btn = createElement('button', {
		id,
		title: label,
		...(isToggle && { 'aria-pressed': String(pressedDefault) }),
		className: isToggle ? 'toggle' : '',
	})

	const iconEl = createElement('iconify-icon', { icon, width: '32' })
	btn.appendChild(iconEl)

	label && btn.appendChild(createElement('span', { textContent: label }))
	createClickHandler(btn, () => handler(btn, showToast))

	return btn
}

const iconStyle = 'bold'
// const iconStyle = 'outline'
// const iconStyle = 'broken'
// const iconStyle = 'linear'

// Button configurations
const BUTTON_CONFIGS = [
	[
		'copy-to-clipboard',
		'Copy to clipboard',
		`solar:copy-${iconStyle}`,
		async (_btn, showToast) => {
			const text = await window.getMarkdown?.()
			if (text) await copySmart(text, showToast)
		},
	],
	[
		'load-from-clipboard',
		'Load from clipboard',
		`solar:clipboard-text-${iconStyle}`,
		async (_btn, showToast) => {
			const text = await window.readClipboardSmart?.()
			if (text) {
				const lines = text.split('\n')
				const minLines = 5
				const paddingLines = lines.length < minLines ? 3 : 0
				const paddedText = paddingLines > 0 
					? '\n'.repeat(paddingLines) + text
					: text
				window.setMarkdown?.(paddedText)
				showToast('loaded from clipboard')
			} else showToast('clipboard empty')
		},
	],
	[
		'save-to-file',
		'Save to file',
		`solar:download-${iconStyle}`,
		async (_btn, showToast) => {
			const text = await window.getMarkdown?.()
			if (text) {
				const name = prompt('filename:', 'document.md') || 'document.md'
				downloadText(name, text)
				showToast('saved to file')
			}
		},
	],
	[
		'load-from-file',
		'Load from file',
		`solar:upload-${iconStyle}`,
		async (_btn, showToast) => {
			const text = await openFileText()
			if (text) {
				window.setMarkdown?.(text)
				showToast('loaded from file')
			}
		},
	],
	[
		'toggle-spell',
		'Toggle spell check',
		'solar:spell-check-bold-duotone',
		(btn, showToast) => {
			const pressed = btn.getAttribute('aria-pressed') === 'true'
			btn.setAttribute('aria-pressed', !pressed)
			applySpell(!pressed)
			showToast(pressed ? 'spell check off' : 'spell check on')
		},
		true,
		false,
	],
	[
		'toggle-theme',
		'Toggle theme',
		'solar:sun-bold-duotone',
		(_btn, showToast) => {
			const current = document.documentElement.classList.contains('light') ? 'light' : 'dark'
			const next = current === 'light' ? 'dark' : 'light'
			applyTheme(next)
			showToast(`theme: ${next}`)
		},
		true,
		false,
	],
	[
		'github',
		'GitHub',
		'solar:iconify-icon-bold-duotone',
		(_btn, _showToast) => {
			window.open('https://github.com/metaory/markon', '_blank')
		},
	],
	[
		'sync-scroll',
		'Sync Scrolling',
		'solar:sun-bold-duotone',
		(btn, showToast) => {
		const pressed = btn.getAttribute('aria-pressed') === 'true'
			btn.setAttribute('aria-pressed', !pressed)
			applySyncedScroll(!pressed)
			showToast(pressed ? 'Scroll Sync off' : 'Scroll Sync on')
		},
		true,
		false,
	],
]

// Create all buttons
export const createButtons = showToast => {
	const actions = document.getElementById('actions')
	BUTTON_CONFIGS.forEach(config => {
		const btn = createButton(config, showToast)
		actions.appendChild(btn)
	})
}
