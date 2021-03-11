/* istanbul ignore file */

import { Vue, Provide, Component } from 'vue-property-decorator'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { IngredientCategory } from '~/model/meal/IngredientCategory'
import { GroceryListItem } from '~/model/groceryList/GroceryListItem'

@Component
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
  async downloadSelectorAsPdf (selector: string, name: string): Promise<void> {
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

  downloadCatgeorizedGroceryItemsAsPdf (items: { [key in IngredientCategory]: GroceryListItem[] }): void {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF('p', 'mm', 'a4', 1)
    const fontSize = 9
    let isSecondColumn = false
    let curX = 20

    let curY = 20
    doc.setFontSize(15)
    doc.text(this.$t('plan.groceryList'), curX, curY)
    curY += 10

    doc.setFontSize(fontSize)
    Object.keys(items).forEach((key: string) => {
      if (items[key as IngredientCategory].length === 0) {
        return
      }

      doc.text(this.$t(`categories.${key}`), curX, curY)
      curY += fontSize * 0.5

      items[key as IngredientCategory].forEach((item: GroceryListItem) => {
        doc.text('  - ' + item.amount + ' ' + item.name, curX, curY)
        curY += fontSize * 0.5
      })

      curY += fontSize * 0.25

      if (297 - 20 - curY - 10 <= 0) {
        if (isSecondColumn) {
          isSecondColumn = false
          curX = 20
          curY = 30
          doc.addPage()
        } else {
          isSecondColumn = true
          curX = 210 / 2
          curY = 30
        }
      }
    })

    doc.save('grocerylist.pdf')
  }
}
