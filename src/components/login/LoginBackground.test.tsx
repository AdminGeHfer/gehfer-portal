import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { LoginBackground } from './LoginBackground'

describe('LoginBackground', () => {
  console.log('🎨 Iniciando testes do LoginBackground...')
  
  it('should render background elements', () => {
    console.log('🖼️ Testando elementos do background...')
    const { container } = render(<LoginBackground />)
    
    const gradientBg = container.querySelector('.bg-gradient-to-br')
    const patternBg = container.querySelector('[class*="bg-[url(\'/pattern.png\')]"]')
    
    console.log('Elementos encontrados:', {
      gradient: gradientBg ? 'presente' : 'ausente',
      pattern: patternBg ? 'presente' : 'ausente'
    })
    
    expect(gradientBg).toBeInTheDocument()
    expect(patternBg).toBeInTheDocument()
  })

  it('should render animated reflections', () => {
    console.log('✨ Testando reflexos animados...')
    const { container } = render(<LoginBackground />)
    
    const reflections = container.querySelectorAll('.bg-white\\/10')
    console.log(`Número de reflexos encontrados: ${reflections.length}`)
    
    expect(reflections).toHaveLength(3)
  })

  it('should apply correct animation classes', () => {
    console.log('🎬 Testando classes de animação...')
    const { container } = render(<LoginBackground />)
    
    const gradientElement = container.querySelector('.animate-gradient')
    console.log('Elemento com animação:', gradientElement ? 'presente' : 'ausente')
    
    expect(gradientElement).toBeInTheDocument()
  })
})