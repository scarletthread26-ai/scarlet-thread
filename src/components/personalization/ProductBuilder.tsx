"use client"

import { useState, useRef, useEffect } from 'react'
import { usePersonalizationStore } from '@/store/usePersonalizationStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Type, Palette, Move, Save } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ProductBuilderProps {
  productId: string;
  baseImage: string;
}

const FONTS = [
  { name: 'Elegant Script', value: 'font-heading italic' },
  { name: 'Modern Sans', value: 'font-sans' },
  { name: 'Luxury Serif', value: 'font-heading' },
]

export function ProductBuilder({ productId, baseImage }: ProductBuilderProps) {
  const store = usePersonalizationStore()
  const previewRef = useRef<HTMLDivElement>(null)
  
  // Local state for dragging text
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    store.setProductId(productId)
    return () => store.reset()
  }, [productId])

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !previewRef.current) return

    let clientX, clientY
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const rect = previewRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100

    // Constrain to bounds
    const boundedX = Math.max(0, Math.min(100, x))
    const boundedY = Math.max(0, Math.min(100, y))

    store.setTextPosition({ x: boundedX, y: boundedY })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, this would upload to Cloudinary. For now we use object URL for local preview.
      const objectUrl = URL.createObjectURL(file)
      store.setPhotoUrl(objectUrl)
      toast.success("Photo uploaded successfully!")
    }
  }

  const handleSavePreview = () => {
    toast.success("Customization saved to your cart!")
    // Here we would potentially serialize the canvas or state and add to cart store
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[600px]">
      
      {/* Left: Live Preview Panel */}
      <div className="bg-secondary/20 rounded-3xl p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div 
          ref={previewRef}
          className="relative w-full max-w-md aspect-square bg-white rounded-xl shadow-sm border border-border/50 overflow-hidden cursor-crosshair"
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchMove={handleDrag}
          onTouchEnd={handleDragEnd}
        >
          {/* Base Product Image */}
          <div className="absolute inset-0 bg-secondary flex items-center justify-center">
             {/* Actual implementation would use Next Image with baseImage */}
             <div className="text-muted-foreground font-medium text-sm">Product Base Image</div>
          </div>

          {/* Uploaded Photo/Logo Overlay */}
          {store.photoUrl && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
               <img src={store.photoUrl} alt="User Upload" className="object-contain w-3/4 h-3/4" />
            </div>
          )}

          {/* Draggable Text Overlay */}
          {(store.name || store.customText) && (
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move p-2 border border-transparent hover:border-primary/50 transition-colors rounded select-none"
              style={{ 
                left: `${store.textPosition.x}%`, 
                top: `${store.textPosition.y}%`,
                color: store.fontColor
              }}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              {store.name && <div className={`${store.fontStyle} text-3xl mb-1 text-center leading-none`}>{store.name}</div>}
              {store.customText && <div className={`${store.fontStyle} text-xl text-center leading-none opacity-90`}>{store.customText}</div>}
            </div>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          <Move className="inline-block w-3 h-3 mr-1" />
          Drag text to position it. Preview is approximate.
        </p>
      </div>

      {/* Right: Controls Panel */}
      <div className="bg-white rounded-3xl shadow-sm border border-border p-6 md:p-8 flex flex-col">
        <h3 className="text-2xl font-heading font-bold mb-6">Personalize Your Item</h3>
        
        <Tabs defaultValue="text" className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary/50">
            <TabsTrigger value="text"><Type className="w-4 h-4 mr-2"/> Text</TabsTrigger>
            <TabsTrigger value="style"><Palette className="w-4 h-4 mr-2"/> Style</TabsTrigger>
            <TabsTrigger value="upload"><Upload className="w-4 h-4 mr-2"/> Upload</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto pr-2">
            <TabsContent value="text" className="space-y-6 mt-0">
              <div className="space-y-2">
                <Label htmlFor="name">Name / Initials</Label>
                <Input 
                  id="name" 
                  placeholder="e.g., Ayaan" 
                  value={store.name}
                  onChange={(e) => store.setName(e.target.value)}
                  className="bg-secondary/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customText">Custom Message</Label>
                <Input 
                  id="customText" 
                  placeholder="e.g., Best Son Ever" 
                  value={store.customText}
                  onChange={(e) => store.setCustomText(e.target.value)}
                  className="bg-secondary/30"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="style" className="space-y-6 mt-0">
              <div className="space-y-2">
                <Label>Font Style</Label>
                <Select value={store.fontStyle} onValueChange={(value) => value && store.setFontStyle(value)}>
                  <SelectTrigger className="w-full bg-secondary/30">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONTS.map(font => (
                      <SelectItem key={font.value} value={font.value}>
                        <span className={font.value}>{font.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Thread Color</Label>
                <div className="flex flex-wrap gap-3">
                  {['#000000', '#FFFFFF', '#D4AF37', '#C0C0C0', '#E5A9A9', '#89CFF0', '#5B3256'].map(color => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full border-2 shadow-sm transition-all ${store.fontColor === color ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => store.setFontColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-6 mt-0">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-primary mb-4" />
                <h4 className="font-semibold mb-2">Upload Photo or Logo</h4>
                <p className="text-xs text-muted-foreground mb-4">PNG, JPG or WEBP (Max 5MB)</p>
                <Input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                  onChange={handlePhotoUpload}
                />
                <Button variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
                  Select File
                </Button>
              </div>
              
              {store.photoUrl && (
                <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-lg border border-border">
                  <span className="text-sm font-medium">Image Uploaded</span>
                  <Button variant="ghost" size="sm" className="text-destructive h-8 px-2" onClick={() => store.setPhotoUrl(null)}>
                    Remove
                  </Button>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-foreground">Personalization Addon</span>
            <span className="font-bold text-lg text-primary">+AED 199</span>
          </div>
          <Button size="lg" className="w-full rounded-full h-12 shadow-md" onClick={handleSavePreview}>
            <Save className="w-4 h-4 mr-2" /> Save & Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
