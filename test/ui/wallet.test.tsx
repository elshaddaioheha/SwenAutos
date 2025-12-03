import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';

// Mock next/navigation
const pushMock = vi.fn();
vi.mock('next/navigation', async () => ({ useRouter: () => ({ push: pushMock }) }));

// Mock AuthProvider so we can observe login()
let loginMock = vi.fn();
vi.mock('@/components/providers/AuthProvider', () => ({ useAuth: () => ({ isAuthenticated: false, login: loginMock }) }));

// Mock wagmi and origin hooks
vi.mock('wagmi', () => ({ useAccount: () => ({ address: undefined }) }));

// We'll provide two separate mock behaviours for origin/react in two tests below

// Import the LoginButton component (after mocks above)
// We'll import LoginButton dynamically after setting up per-test mocks so that
// the module-level imports (origin/react, wagmi) are intercepted correctly.

describe('LoginButton (wallet) integration', () => {
  beforeEach(() => {
    // Clear mocks and module cache to make sure per-test vi.doMock calls behave
    // predictably when we dynamically import the component under test.
    vi.resetAllMocks();
    vi.resetModules();
    // reinitialize login mock so counts are clean
    loginMock = vi.fn();
    // our AuthProvider mock (above) closes over loginMock, but vitest's mock system caches
    // so re-define the module mock for AuthProvider to return the new loginMock on each test
    vi.doMock('@/components/providers/AuthProvider', () => ({ useAuth: () => ({ isAuthenticated: false, login: loginMock }) }));
  });

  it('calls useConnect.connect when the wallet button is clicked', async () => {
    // origin connect implementation that we can observe
    const connectMock = vi.fn(async () => {});
    // ensure origin/react returns unauthenticated
    vi.doMock('@campnetwork/origin/react', () => ({ useAuthState: () => ({ authenticated: false, loading: false }), useConnect: () => ({ connect: connectMock }) }));

    // make sure window.ethereum is present (jsdom default doesn't provide it)
    (global as any).window = (global as any).window || {};
    (global as any).window.ethereum = {};

    // import after mocking origin so the component reads the mocked hooks
    const { LoginButton } = await import('@/components/auth/LoginButton');
    const { getByRole } = render(<LoginButton redirectUrl="/dashboard" />);

    const btn = getByRole('button');
    fireEvent.click(btn);

    // connect should be called
    await waitFor(() => expect(connectMock).toHaveBeenCalled());
  });

  it('when authenticated + address present, it syncs to AuthProvider login and redirects', async () => {
    // Mock origin/react to present a connected user
    const mockAddress = '0xDEADBEEF0123456789';
    // ensure connect is a no-op for this flow
    const connectMock = vi.fn(async () => {});

    // reset module cache and mock origin + wagmi so the imported component picks up mocked hooks
    vi.resetModules();
    vi.doMock('@campnetwork/origin/react', () => ({ useAuthState: () => ({ authenticated: true, loading: false }), useConnect: () => ({ connect: connectMock }) }));
    // Mock wagmi useAccount to return an address
    vi.doMock('wagmi', () => ({ useAccount: () => ({ address: mockAddress }) }));

    // Re-import LoginButton with the new module mocks (vitest keeps a module cache)
    // To ensure fresh module imports we reset modules and import the component freshly
    // However the component file is already imported at top-level; to avoid complicated module
    // reloading logic here we will render the component and then assert behaviour.

    // Render the button - because useAuthState already reports authenticated=true and useAccount has an address
    // the component's useEffect should trigger login() and push().
    const { LoginButton } = await import('@/components/auth/LoginButton');
    render(<LoginButton redirectUrl="/my/bench" />);

    // Wait until our mocked login has been called (by LoginButton useEffect)
    await waitFor(() => expect(loginMock).toHaveBeenCalled());

    // assert router push called
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/my/bench'));
  });
});
