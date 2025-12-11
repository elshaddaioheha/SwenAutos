import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach, Mock } from 'vitest';

// Mock next/navigation
const pushMock = vi.fn();
vi.mock('next/navigation', async () => ({ useRouter: () => ({ push: pushMock }) }));

// Mock AuthProvider so we can observe login()
let loginMock = vi.fn();
vi.mock('@/components/providers/AuthProvider', () => ({ useAuth: () => ({ isAuthenticated: false, login: loginMock }) }));
vi.mock('@/components/ToastProvider', () => ({ useToast: () => ({ push: vi.fn() }) }));

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

    // Import component (it will use the top-level mocks which now redirect to our mock variables)
    // We don't need dynamic import anymore for mocks, but let's keep it simple
    // Actually, dynamic import is fine but with the new mocking strategy standard import is also fine if we didn't have to worry about hoisting
    // But since we define mocks at top level, standard import is safer.
    // However, I will stick to dynamic to minimize changes to structure if not needed. 
    // Wait, dynamic import is NOT needed if we use mutable mocks at top level.
    const { LoginButton } = await import('@/components/auth/LoginButton');

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

    const { LoginButton } = await import('@/components/auth/LoginButton');
    render(<LoginButton redirectUrl="/my/bench" />);

    await waitFor(() => expect(loginMock).toHaveBeenCalled());
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/my/bench'));
  });
});
