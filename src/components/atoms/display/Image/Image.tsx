import type React from 'react'
import type { ImageProps } from './Image.props'

const Image: React.FC<ImageProps> = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={`w-full h-full object-cover ${className || ''}`} />
)

export default Image
