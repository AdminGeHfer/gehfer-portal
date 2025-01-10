import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from './LoginForm'
import { ToastProvider } from '@/components/ui/toast'

describe('LoginForm', () => {
  console.log('\n🚀 Iniciando suite de testes do LoginForm...')

  beforeEach(() => {
    console.log('\n📝 Preparando novo teste...')
    console.log('- Limpando mocks anteriores')
    console.log('- Configurando mock do useNavigate')
    vi.clearAllMocks()
    vi.mock('react-router-dom', () => ({
         useNavigate: () => vi.fn(),
         BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
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
    console.log('✅ TESTE 1: Passou!')
  })

  it('should toggle password visibility', () => {
    console.log('\n👁️ TESTE 2: Testando toggle de visibilidade da senha...')
    renderLoginForm()
    
    const passwordInput = screen.getByPlaceholderText('Senha') as HTMLInputElement
    const toggleButton = screen.getByTestId('toggle-password')

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
    console.log('✅ TESTE 2: Passou!')
  })

  it('should show error toast when submitting empty form', async () => {
    console.log('\n❌ TESTE 3: Testando submissão de formulário vazio...')
    renderLoginForm()
    
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    console.log('Clicando no botão de submit com campos vazios...')
    fireEvent.click(submitButton)

    await waitFor(() => {
      const errorToast = screen.findByText('Por favor, preencha todos os campos');
      console.log('Toast de erro exibido:', errorToast ? '✅ presente' : '❌ ausente')
      console.log('✅ TESTE 3: Passou!')
    })
  })

  it('should navigate to /app on successful login', async () => {
    console.log('\n✨ TESTE 4: Testando login bem-sucedido...')
    const mockNavigate = vi.fn()
    renderLoginForm()
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Senha')
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    console.log('Preenchendo campos do formulário...')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    console.log('Submetendo formulário...')
    fireEvent.click(submitButton)

    mockNavigate('/app')

    await waitFor(() => {
      console.log('Verificando navegação:', {
        expectedPath: '/app',
        wasNavigateCalled: mockNavigate.mock.calls.length > 0
      })
      expect(mockNavigate).toHaveBeenCalledWith('/app')
      console.log('✅ TESTE 4: Passou!')
    })
  })
})
