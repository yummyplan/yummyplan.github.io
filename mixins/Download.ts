/* istanbul ignore file */

import { Vue, Provide } from 'vue-property-decorator'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default class DownloadMixin extends Vue {
  @Provide() downloading = false

  /**
   * Creates a PNG out of the weekplan DOM.
   */
  createPng (selector: string): Promise<{ img: string | undefined, imageWidth: number, imageHeight: number }> {
    const html = document.querySelector(selector)

    if (!process.browser || !html) {
      throw new Error('Either not in browser or HTML not present.')
    }

    const options = {
      background: 'white',
      allowTaint: true,
      useCORS: true,
      foreignObjectRendering: true,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0
    }

    return this.$nextTick().then(() => {
      return html2canvas(html as HTMLElement, options)
    }).then((canvas) => {
      const imageWidth = html.clientWidth
      const imageHeight = html.clientHeight

      this.downloading = false
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.imageSmoothingEnabled = true
      }

      const img = canvas.toDataURL('image/PNG')

      return {
        img,
        imageWidth,
        imageHeight
      }
    })
  }

  /**
   * Downloads the week plan as PDF
   */
  async downloadAsPdf (selector: string, name: string): Promise<void> {
    this.downloading = true

    try {
      const { img, imageWidth, imageHeight } = await this.createPng(selector)
      const imageAspectRatio = imageWidth / imageHeight

      // eslint-disable-next-line new-cap
      const doc = new jsPDF('p', 'mm', 'a4', 1)

      const bufferX = 5
      const bufferY = 5
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const pageAspectRatio = pageWidth / pageHeight

      let scaleFactor = pageHeight / imageHeight
      if (imageAspectRatio > pageAspectRatio) {
        scaleFactor = pageWidth / imageWidth
      }

      const pdfWidth = imageWidth * scaleFactor - 2 * bufferX
      const pdfHeight = imageHeight * scaleFactor - 2 * bufferY

      doc.addImage(img, 'PNG', (pageWidth - pdfWidth) / 2, (pageHeight - pdfHeight) / 2, pdfWidth, pdfHeight, undefined, 'FAST')

      doc.save(`${name}.pdf`)

      this.downloading = false
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }
}
