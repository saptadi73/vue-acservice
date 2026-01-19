declare module 'html2pdf.js' {
  type ImageOptions = {
    type?: 'jpeg' | 'png'
    quality?: number
  }

  type Html2CanvasOptions = {
    scale?: number
    useCORS?: boolean
  }

  type JsPDFOptions = {
    orientation?: 'portrait' | 'landscape'
    unit?: 'mm' | 'pt' | 'in' | 'cm'
    format?: string | [number, number]
  }

  type Options = {
    margin?: number | number[]
    filename?: string
    image?: ImageOptions
    html2canvas?: Html2CanvasOptions
    jsPDF?: JsPDFOptions
  }

  export type Html2PdfInstance = {
    set(options: Options): Html2PdfInstance
    from(element: HTMLElement | string): Html2PdfInstance
    save(): Promise<void>
    // some builds expose additional helpers
    outputPdf?: (...args: any[]) => any
  }

  const html2pdf: () => Html2PdfInstance
  export default html2pdf
}
