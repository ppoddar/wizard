class WizardPage {
    constructor(data) {
        data = data || {}
        this.title  = data['title']  || 'no title'
        this.width  = data['width']  || 300
        this.height = data['height']  || 200
    }
}
export default WizardPage