// Shared utilities - no imports to avoid circular dependencies
export const $ = sel => document.getElementById(sel)
export const el = (tag, attrs = {}) => Object.assign(document.createElement(tag), attrs)

// Toast and paste overlay styles
const styles = `
#toast {
	position: fixed;
	bottom: 16px;
	left: 50%;
	color: var(--accent);
	transform: translateX(-50%);
	background: var(--bg-light);
	border: 1px solid var(--accent-alpha);
	padding: 12px 20px;
	border-radius: 14px;
	box-shadow: 0 4px 20px var(--accent-alpha);
	backdrop-filter: blur(10px);
	z-index: 1100;
	max-width: 90vw;
	white-space: nowrap;
	opacity: 0;
	transition: opacity 0.3s ease;
}

#toast:not([hidden]) {
	opacity: 1;
}

`

// Inject styles
const styleSheet = document.createElement('style')
styleSheet.textContent = styles
document.head.appendChild(styleSheet)


// Toast utility
export const createToast =
	toast =>
	(msg, ms = 1_200) => {
		toast.textContent = msg
		toast.removeAttribute('hidden')
		clearTimeout(window.__toastTimer)
		window.__toastTimer = setTimeout(() => {
			toast.setAttribute('hidden', '')
		}, ms)
	}

// Clipboard utilities
export const copySmart = async (text, notify) => {
	const fallback = () => {
		const ta = el('textarea', { 
			value: text, 
			style: 'position:fixed;top:-9999px;left:-9999px;opacity:0;width:1px;height:1px;border:none;outline:none;resize:none;overflow:hidden;'
		})
		document.body.appendChild(ta)
		ta.focus()
		ta.select()
		const ok = document.execCommand('copy')
		notify(ok ? 'copied to clipboard' : 'copy failed')
		ta.remove()
	}

	return (
		navigator.clipboard
			?.writeText?.(text)
			?.then(() => notify('copied to clipboard'))
			?.catch(fallback) ?? fallback()
	)
}

export const readClipboardSmart = async () =>
	!navigator.clipboard?.readText ? null : await navigator.clipboard.readText().catch(() => null)

// File utilities
export const downloadText = (name, text) => {
	const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }))
	const a = el('a', { href: url, download: name })
	document.body.appendChild(a)
	a.click()
	a.remove()
	URL.revokeObjectURL(url)
}

export const openFileText = () =>
	new Promise(resolve => {
		const input = el('input', { type: 'file', accept: '.md,text/markdown,text/plain' })
		input.onchange = async () => {
			const file = input.files?.[0]
			resolve(file ? await file.text() : null)
		}
		input.click()
	})


// Theme utilities
export const getPrefTheme = () =>
	localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')

export const applyTheme = theme => {
	const isLight = theme === 'light'
	document.documentElement.classList.toggle('light', isLight)
	localStorage.setItem('theme', isLight ? 'light' : 'dark')
}

// Spell check utility
export const applySpell = (on = document.querySelector('#toggle-spell')?.getAttribute('aria-pressed') === 'true') => {
	document.querySelector('.cm-content')?.setAttribute('spellcheck', String(on))
}


// Enhanced element creation utility
export const createElement = (tag, attributes = {}, children = []) => {
	const element = Object.assign(document.createElement(tag), attributes)
	children.forEach(child => {
		element.appendChild(child)
	})
	return element
}

// Event handler utilities
export const createEventHandler = (element, event, handler, options = {}) => {
	element.addEventListener(event, handler, options)
	return () => element.removeEventListener(event, handler, options)
}

export const createClickHandler = (element, handler) => createEventHandler(element, 'click', handler)
export const createPointerHandler = (element, handler) => createEventHandler(element, 'pointerdown', handler)
export const createKeyHandler = (element, handler) => createEventHandler(element, 'keydown', handler)

// Scroll Syncing Utility
let editorScroller = null;
let previewScroller = null;

let onEditorScroll = null;
let onPreviewScroll = null;

export const applySyncedScroll = (on = document.querySelector('#sync-scroll')?.getAttribute('aria-pressed') === 'true') => {
	if (!editorScroller || !previewScroller) {
		editorScroller = document.querySelector('#editor .cm-scroller');
		previewScroller = document.getElementById('previewhtml');

		if (!editorScroller || !previewScroller) {
			console.warn('Cannot find editorScroller or previewScroller elements');
			return;
		}

		function syncScroll(source, target) {
			const scrollPercent = source.scrollTop / (source.scrollHeight - source.clientHeight);
			target.scrollTop = (target.scrollHeight - target.clientHeight) * scrollPercent;
		}

		onEditorScroll = () => syncScroll(editorScroller, previewScroller);
		onPreviewScroll = () => syncScroll(previewScroller, editorScroller);
	}

	if (on) {
		editorScroller.addEventListener('scroll', onEditorScroll);
		previewScroller.addEventListener('scroll', onPreviewScroll);
	} else {
		editorScroller.removeEventListener('scroll', onEditorScroll);
		previewScroller.removeEventListener('scroll', onPreviewScroll);
	}
}