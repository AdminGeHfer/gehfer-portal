import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LoginBackground } from './LoginBackground'

describe('LoginBackground', () => {
  it('should render background elements', () => {
    const { container } = render(<LoginBackground />)
    
    expect(container.querySelector('.bg-gradient-to-br')).toBeInTheDocument()
    expect(container.querySelector('.bg-\\[url\\(\\\'/pattern\\.png\\\'\\)\\]')).toBeInTheDocument()
  })

  it('should render animated reflections', () => {
    const { container } = render(<LoginBackground />)
    
    const reflections = container.querySelectorAll('.bg-white\\/10')
    expect(reflections).toHaveLength(3)
  })
})