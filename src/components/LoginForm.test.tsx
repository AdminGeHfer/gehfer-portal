import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from './LoginForm'
import { ToastProvider } from '@/components/ui/toast'

describe('LoginForm', () => {
  const renderLoginForm = () => {
    return render(
      <BrowserRouter>
        <ToastProvider>
          <LoginForm />
        </ToastProvider>
      </BrowserRouter>
    )
  }

  it('should render email and password inputs', () => {
    renderLoginForm()
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
  })

  it('should toggle password visibility', () => {
    renderLoginForm()
    
    const passwordInput = screen.getByPlaceholderText('Senha')
    expect(passwordInput).toHaveAttribute('type', 'password')

    const toggleButton = screen.getByRole('button', { name: /toggle password/i })
    fireEvent.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('should show error toast when submitting empty form', () => {
    renderLoginForm()
    
    const submitButton = screen.getByRole('button', { name: /entrar/i })
    fireEvent.click(submitButton)

    expect(screen.getByText('Erro ao fazer login')).toBeInTheDocument()
    expect(screen.getByText('Por favor, preencha todos os campos')).toBeInTheDocument()
  })

  it('should navigate to /app on successful login', () => {
    const navigateMock = vi.fn()
    vi.mock('react-router-dom', () => ({
      ...vi.importActual('react-router-dom'),
      useNavigate: () => navigateMock,
    }))

    renderLoginForm()
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Senha')
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    expect(navigateMock).toHaveBeenCalledWith('/app')
  })
})