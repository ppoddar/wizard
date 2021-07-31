import WizardPage from "./wizardpage.js"

/** 
 * Am wizard controls a serials of pages.
 * The pages are presnted in the order of their addition to the wizard.
 * The wizard provides the naviagtion buttons next, back, finish depending
 * on a pages position is the sequence.
 */
class Wizard {
    /**
     * construct an wizard with options
     * @param {dict} data optional dictionary with following properties
     *     title
     *     width
     *     height
     */
    constructor(data) {
        data = data || {}
        this.title  = data['title']  || 'no title'
        this.width  = data['width']  || 300
        this.height = data['height']  || 200
        this.payload  = {}
        this.cursor   = 0
        this.pages    = []
        this.$dialogs = []
        var _this = this
        this.goNext = function() {
            _this.showPage(_this.cursor+1)
        }
        this.goPrev = function()  {
            _this.showPage(_this.cursor-1)
        }
        this.finish = function()  {
            _this.currentDialog().dialog('close')
            _this.callback.call(_this, _this.payload)
        }
    }

    /**
     * Adds an wizard page.
     * @param {WizardPage} page 
     */
    add(page) {
        if (page)
            if (page instanceof WizardPage)
               this.pages.push(page)
            else
                throw `${page.constructor.name} is not a WizardPage`
    }
    /*
     * gets dialog at current cursor position
     * @retunrs current dialog. may be null.
     */
    currentDialog() {
        return this.getDialogAt(this.cursor)

    }
    /*
     * gets dialog at given 0-based index 
     * @retunrs dialog at given index. may be null.
     */
    getDialogAt(idx) {
        if (idx < this.$dialogs.length && idx >= 0)
            return this.$dialogs[idx]

    }
    /**
     * Opens this wizard. Displays the first page.
     * @param {*} cb optional callback function. The function wil be called
     * back with a dictionary of input values as supplied by each page
     */
    open(cb) {
        this.callback = cb
        this.showPage(0)
    }

    /**
     * shows a dialog at given index
     * hides the dialog currently being shown
     * changes the cursor to given index
     * @param {*} idx 
     */
    showPage(idx) {
        var $current = this.currentDialog()
        if ($current) $current.dialog('close')
            
        this.cursor = idx
        var opts = this.optionsFor(idx)
        var $dialog = this.getDialogAt(idx)
        if ($dialog) {
            $dialog.dialog('open')
        } else { 
            var $dialog = $('<div>')
            this.$dialogs[this.cursor] = $dialog
            $dialog.dialog(opts)
        }
    }
    /**
     * gets the options for page at given index
     * @param {int} idx 
     * @returns a dictinary of dialog options
     */
    optionsFor(idx) {
        if (idx < 0) return
        if (idx >= this.pages.length) return
        
        var page = this.pages[idx]
        var _this = this
        // the navigation buttons. Each associate with a function
        var next   = {'id':'next',   'text':'next',   'click': _this.goNext.bind(_this)}
        var prev   = {'id':'back',   'text':'back',   'click': _this.goPrev.bind(_this)}
        var finish = {'id':'finish', 'text':'finish', 'click': _this.finish.bind(_this)}
        // buttons are present based on the pages position within this wizard
        var buttons = []
        if (idx == 0) {
            buttons = [next]
        } else if (idx == this.pages.length -1) {
            buttons = [prev, finish]
        } else {
            buttons = [prev, next, finish]
        }
        var title = page.title || this.title
        var opts = {
            autoOpen  : true,
            modal     : false,
            minWidth  : this.width,
            minHeight : this.height,
            title     : title,
            buttons   : buttons,
            open      : function() {
                //console.log(`opened page ${title}`)

            }
        }
        return opts
    }
}
export default Wizard