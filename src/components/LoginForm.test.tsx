import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from './LoginForm'
import { ToastProvider } from '@/components/ui/toast'

describe('LoginForm', () => {
  console.log('🧪 Iniciando testes do LoginForm...')
  
  const mockNavigate = vi.fn()

  beforeEach(() => {
    console.log('📝 Preparando novo teste...')
    vi.clearAllMocks()
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      }
    })
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
    console.log('👀 Testando renderização dos campos...')
    renderLoginForm()
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Senha')
    
    console.log('✅ Campos encontrados:', {
      email: emailInput ? 'presente' : 'ausente',
      password: passwordInput ? 'presente' : 'ausente'
    })
    
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
  })

  it('should toggle password visibility', () => {
    console.log('👁️ Testando toggle de visibilidade da senha...')
    renderLoginForm()
    
    const passwordInput = screen.getByPlaceholderText('Senha')
    console.log('Tipo inicial do campo:', passwordInput.getAttribute('type'))
    
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByRole('button', { name: /toggle password/i })
    fireEvent.click(toggleButton)
    
    console.log('Tipo após toggle:', passwordInput.getAttribute('type'))
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('should show error toast when submitting empty form', async () => {
    console.log('❌ Testando submissão de formulário vazio...')
    renderLoginForm()
    
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errorTitle = screen.getByText('Erro ao fazer login')
      const errorMessage = screen.getByText('Por favor, preencha todos os campos')
      
      console.log('Mensagens de erro:', {
        title: errorTitle ? 'presente' : 'ausente',
        message: errorMessage ? 'presente' : 'ausente'
      })
      
      expect(errorTitle).toBeInTheDocument()
      expect(errorMessage).toBeInTheDocument()
    })
  })

  it('should navigate to /app on successful login', async () => {
    console.log('✨ Testando login bem-sucedido...')
    renderLoginForm()
    
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    console.log('Valores preenchidos:', {
      email: emailInput.value,
      password: passwordInput.value
    })
    
    fireEvent.click(submitButton)

    await waitFor(() => {
      console.log('Navegação chamada com:', mockNavigate.mock.calls[0]?.[0])
      expect(mockNavigate).toHaveBeenCalledWith('/app')
    })
  })

  it('should handle form input changes', () => {
    console.log('⌨️ Testando mudanças nos inputs...')
    renderLoginForm()
    
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    console.log('Valores após mudança:', {
      email: emailInput.value,
      password: passwordInput.value
    })

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })
})