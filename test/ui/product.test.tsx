import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';

// Mock next/image to a simple img
vi.mock('next/image', () => ({ __esModule: true, default: ({ src, alt }: any) => React.createElement('img', { src, alt }) }));
vi.mock('next/link', () => ({ __esModule: true, default: ({ children }: any) => React.createElement('span', null, children) }));

// Mock router push
const pushMock = vi.fn();
vi.mock('next/navigation', async () => ({ useRouter: () => ({ push: pushMock }) }));

// Mock auth hooks (start unauthenticated by default)
let authState = { isAuthenticated: false };
const loginMock = vi.fn((user: any) => { authState.isAuthenticated = true; });
vi.mock('@/components/providers/AuthProvider', () => ({ useAuth: () => ({ ...authState, login: loginMock }), }));
vi.mock('@campnetwork/origin/react', () => ({ useAuthState: () => ({ authenticated: false, loading: false }), useConnect: () => ({ connect: async () => { } }) }));

// Mock wagmi hooks used by LoginButton (avoid needing a WagmiProvider in tests)
vi.mock('wagmi', () => ({
  useAccount: () => ({ address: undefined }),
  useConnect: () => ({ connect: vi.fn(), connectors: [] }),
}));

vi.mock('@/components/ToastProvider', () => ({ useToast: () => ({ push: vi.fn() }) }));

// Mock cart provider
const addItemMock = vi.fn();
vi.mock('@/components/providers/CartProvider', () => ({ useCart: () => ({ addItem: addItemMock }) }));

// don't mock PayWithFiatWrapper here (we will test its wrapper behaviour)

// Import component under test after mocks
import LoginModal from '@/components/auth/LoginModal';
import { PayWithFiatWrapper } from '@/components/payment/PayWithFiatWrapper';

describe('LoginModal component', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders and calls onSuccess after local sign-in', async () => {
    const onSuccess = vi.fn();
    render(<LoginModal isOpen={true} onClose={() => { }} onSuccess={onSuccess} />);

    // The LoginModal uses plain labels without htmlFor/id so getByLabelText won't find them.
    // Select by input type instead.
    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
    const passInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    const submit = document.querySelector('form button[type="submit"]') as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: 'me@example.com' } });
    fireEvent.change(passInput, { target: { value: 'Password123' } });
    fireEvent.click(submit);

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });
});

describe('PayWithFiatWrapper auth behavior', () => {
  beforeEach(() => vi.clearAllMocks());

  // ensure global auth state is unauthenticated for these tests
  beforeEach(() => { authState.isAuthenticated = false; });

  it('prompts to sign in when unauthenticated', async () => {
    // Ensure useAuth mocked state is unauthenticated (setup in module mock above)
    render(<PayWithFiatWrapper email="x@x.com" amount={100} />);

    const prompt = await screen.findByText(/You must be signed in to pay with fiat/i);
    expect(prompt).toBeTruthy();
    const btn = screen.getByRole('button', { name: /Sign in to pay/i });
    fireEvent.click(btn);

    const modalHeading = await screen.findByText(/Sign in to continue/i);
    expect(modalHeading).toBeTruthy();
  });
});
