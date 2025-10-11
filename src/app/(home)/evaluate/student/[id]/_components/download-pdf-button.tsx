'use client'

import { Button } from '@/components/ui/button'
import { handleDownloadEvaluationPDF } from '@/http/handle-http-evaluate'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function DownloadPdfButton({ id }: { id: string }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true)

      const { data, filename, contentType } =
        await handleDownloadEvaluationPDF(id)

      // Convert base64 to blob
      const byteCharacters = atob(data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: contentType })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('PDF baixado com sucesso!', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
    } catch (error) {
      console.error('Erro ao fazer download do PDF:', error)
      toast.error('Erro ao fazer download do PDF.', {
        position: 'top-center',
        style: { filter: 'none', zIndex: 10 },
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      onClick={handleDownloadPdf}
      disabled={isDownloading}
      variant='blue'
      className='flex items-center gap-2'
    >
      <Download className='size-4' />
      <p className='hidden sm:flex'>
        {isDownloading ? 'Baixando...' : 'Exportar PDF'}
      </p>
    </Button>
  )
}
