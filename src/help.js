import { createClickHandler, createElement } from './utils.js'

// Hotkey configuration - single source of truth
const HOTKEYS = [
	['t', 'Toggle theme', 'toggle-theme'],
	['s', 'Toggle spell check', 'toggle-spell'],
	['p', 'Toggle preview', 'toggle-preview'],
	['c', 'Copy to clipboard', 'copy-to-clipboard'],
	['f', 'Save to file', 'save-to-file'],
	['o', 'Open file', 'load-from-file'],
	['r', 'Sync Scroll', 'sync-scroll'],
]

// Help dialog creation
export const createHelpDialog = () => {
	const overlay = createElement('div', { id: 'help-system', className: 'help-overlay' })
	const dialog = createElement('div', { className: 'help-dialog' })
	const header = createElement('div', { className: 'help-header' })
	const title = createElement('h2', { className: 'help-title', textContent: 'Keyboard Shortcuts' })
	const closeBtn = createElement('button', { className: 'help-close', textContent: '×' })
	const shortcuts = createElement('div', { className: 'help-shortcuts' })
	const footer = createElement('div', { className: 'help-footer' })
	const heart = createElement('span', { className: 'heart', textContent: '❤️' })
	const text1 = document.createTextNode('Made with ')
	const text2 = document.createTextNode(' by ')
	const githubProfileLink = createElement('a', {
		href: 'https://github.com/metaory',
		target: '_blank',
		textContent: 'github.metaory'
	})
	const text3 = document.createTextNode('/')
	const githubRepoLink = createElement('a', {
		href: 'https://github.com/metaory/markon',
		target: '_blank',
		textContent: 'markon'
	})
	footer.append(text1, heart, text2, githubProfileLink, text3, githubRepoLink)

	// Build shortcuts list
	HOTKEYS.forEach(([key, desc]) => {
		const item = createElement('div', { className: 'help-item' })
		item.append(
			createElement('kbd', { className: 'help-key', textContent: key }),
			createElement('span', { className: 'help-desc', textContent: desc }),
		)
		shortcuts.appendChild(item)
	})

	header.append(title, closeBtn)
	dialog.append(header, shortcuts, footer)
	overlay.appendChild(dialog)

	const show = () => {
		document.body.appendChild(overlay)
		requestAnimationFrame(() => {
			overlay.classList.add('visible')
			dialog.classList.add('visible')
		})
	}

	const hide = () => {
		overlay.classList.remove('visible')
		dialog.classList.remove('visible')
		setTimeout(() => overlay.remove(), 200)
	}

	createClickHandler(closeBtn, hide)
	overlay.addEventListener('click', e => e.target === overlay && hide())

	return { show, hide }
}

// Help icon creation
export const createHelpIcon = helpDialog => {
	const icon = createElement('iconify-icon', {
		icon: 'solar:question-square-bold-duotone',
		className: 'help-icon',
		title: 'Show keyboard shortcuts (?)',
		width: '36',
	})
	createClickHandler(icon, () => helpDialog.show())
	return icon
}

// Export hotkeys for use in hotkeys module
export { HOTKEYS }
