import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach, Mock } from 'vitest';
import { LoginButton } from '@/components/auth/LoginButton';

// Mock next/navigation
const pushMock = vi.fn();
vi.mock('next/navigation', async () => ({ useRouter: () => ({ push: pushMock }) }));

// Mock AuthProvider
let loginMock = vi.fn();
vi.mock('@/components/providers/AuthProvider', () => ({ useAuth: () => ({ isAuthenticated: false, login: loginMock }) }));
vi.mock('@/components/ToastProvider', () => ({ useToast: () => ({ push: vi.fn() }) }));

// Mock Supabase
vi.mock('@/lib/supabase', () => {
  const fromMock = vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: { role: 'buyer', full_name: 'Test User' }, error: null }))
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null }))
    }))
  }));
  return {
    supabase: {
      from: fromMock,
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } }, error: null }))
      }
    }
  };
});

// Mock wagmi and origin hooks
const useConnectMock = vi.fn();
const useAccountMock = vi.fn();

vi.mock('wagmi', () => ({
  useAccount: () => useAccountMock(),
  useConnect: () => useConnectMock()
}));

// Mock origin/react
const useAuthStateMock = vi.fn();
vi.mock('@campnetwork/origin/react', () => ({
  useAuthState: () => useAuthStateMock()
}));

describe('LoginButton (wallet) integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loginMock.mockClear();
    pushMock.mockClear();
    useConnectMock.mockReset();
    useAccountMock.mockReset();
    useAuthStateMock.mockReset();

    // Default mocks
    useAuthStateMock.mockReturnValue({ authenticated: false, loading: false });
    useAccountMock.mockReturnValue({ address: undefined, isConnected: false });
    useConnectMock.mockReturnValue({ connect: vi.fn(), connectors: [] });
  });

  it('calls useConnect.connect when the wallet button is clicked', async () => {
    // Setup mocks for this test
    const connectMock = vi.fn();
    useConnectMock.mockReturnValue({
      connect: connectMock,
      connectors: [{ id: 'mock', name: 'Mock Wallet' }]
    });

    // Make sure window.ethereum is present
    (global as any).window = (global as any).window || {};
    (global as any).window.ethereum = {};

    const { getByRole } = render(<LoginButton redirectUrl="/dashboard" />);

    const btn = getByRole('button');
    fireEvent.click(btn);

    await waitFor(() => expect(connectMock).toHaveBeenCalled());
  });

  it('when authenticated + address present, it syncs to AuthProvider login and redirects', async () => {
    const mockAddress = '0xDEADBEEF0123456789';

    useAuthStateMock.mockReturnValue({ authenticated: true, loading: false });
    useAccountMock.mockReturnValue({ address: mockAddress, isConnected: true });
    useConnectMock.mockReturnValue({ connect: vi.fn(), connectors: [{ id: 'mock' }] });

    render(<LoginButton redirectUrl="/my/bench" />);

    await waitFor(() => expect(loginMock).toHaveBeenCalled());
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/my/bench'));
  });
});
