import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from './LoginForm'
import { ToastProvider } from '@/components/ui/toast'
import { act } from 'react-dom/test-utils'

describe('LoginForm', () => {
  console.log('\n🚀 Iniciando suite de testes do LoginForm...')
  
  const mockNavigate = vi.fn()

  beforeEach(() => {
    console.log('\n📝 Preparando novo teste...')
    console.log('- Limpando mocks anteriores')
    console.log('- Configurando mock do useNavigate')
    vi.clearAllMocks()
    vi.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate
    }))
  })

  const renderLoginForm = () => {
    console.log('🎨 Renderizando LoginForm para teste...')
    return render(
      <BrowserRouter>
        <ToastProvider>
          <LoginForm />
        </ToastProvider>
      </BrowserRouter>
    )
  }

  it('should render email and password inputs', () => {
    console.log('\n👀 TESTE 1: Verificando renderização dos campos...')
    renderLoginForm()
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Senha')
    
    console.log('Elementos encontrados:', {
      email: emailInput ? '✅ presente' : '❌ ausente',
      password: passwordInput ? '✅ presente' : '❌ ausente'
    })
    
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
  })

  it('should toggle password visibility', () => {
    console.log('\n👁️ TESTE 2: Testando toggle de visibilidade da senha...')
    renderLoginForm()
    
    const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement
    const toggleButton = screen.getByRole('button', { name: /toggle password/i })
    
    console.log('Estado inicial do campo senha:', {
      type: passwordInput.type,
      isPassword: passwordInput.type === 'password' ? '✅' : '❌'
    })
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    console.log('Clicando no botão de toggle...')
    fireEvent.click(toggleButton)
    
    console.log('Estado após toggle:', {
      type: passwordInput.type,
      isVisible: passwordInput.type === 'text' ? '✅' : '❌'
    })
    
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('should show error toast when submitting empty form', async () => {
    console.log('\n❌ TESTE 3: Testando submissão de formulário vazio...')
    renderLoginForm()
    
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    console.log('Clicando no botão de submit com campos vazios...')
    
    await act(async () => {
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      const errorToast = screen.getByText('Por favor, preencha todos os campos')
      console.log('Toast de erro:', errorToast ? '✅ presente' : '❌ ausente')
      expect(errorToast).toBeInTheDocument()
    })
  })

  it('should navigate to /app on successful login', async () => {
    console.log('\n✨ TESTE 4: Testando login bem-sucedido...')
    renderLoginForm()
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Senha')
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    console.log('Preenchendo campos do formulário...')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    console.log('Submetendo formulário...')
    fireEvent.click(submitButton)

    await waitFor(() => {
      console.log('Verificando navegação:', {
        expectedPath: '/app',
        wasNavigateCalled: mockNavigate.mock.calls.length > 0
      })
      expect(mockNavigate).toHaveBeenCalledWith('/app')
    })
  })
})