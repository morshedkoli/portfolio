'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    label: string
    previewSize?: 'small' | 'medium' | 'large'
    folder?: string
}

export function ImageUpload({ value, onChange, label, previewSize = 'medium', folder = 'portfolio' }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const previewSizes = {
        small: 'w-16 h-16',
        medium: 'w-32 h-32',
        large: 'w-full h-48'
    }

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
            uploadFile(files[0])
        }
    }, [])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            uploadFile(files[0])
        }
    }, [])

    const uploadFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB')
            return
        }

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (data.success) {
                onChange(data.url)
                toast.success('Image uploaded successfully')
            } else {
                toast.error(data.message || 'Upload failed')
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Upload failed')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleRemove = () => {
        onChange('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                {label}
            </label>

            {value ? (
                <div className="relative group">
                    <div className={`relative ${previewSizes[previewSize]} rounded-lg overflow-hidden bg-white/10`}>
                        <Image
                            src={value}
                            alt={label}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        relative border-2 border-dashed rounded-lg cursor-pointer
                        transition-all duration-200 flex flex-col items-center justify-center
                        ${previewSizes[previewSize]}
                        ${isDragging 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                        }
                    `}
                >
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    ) : (
                        <>
                            <Upload className={`w-8 h-8 text-gray-400 ${isDragging ? 'text-blue-400' : ''}`} />
                            <span className={`mt-2 text-xs text-gray-400 ${isDragging ? 'text-blue-400' : ''}`}>
                                Click or drag image
                            </span>
                        </>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            )}
        </div>
    )
}
