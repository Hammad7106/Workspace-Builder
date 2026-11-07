/**
 * jsdom implements <dialog> but not showModal()/close(). This minimal stand-in toggles
 * the `open` attribute and fires `close`, which is all our components rely on.
 * Import it at the top of any component test that opens a dialog.
 */
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.open) return
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}
