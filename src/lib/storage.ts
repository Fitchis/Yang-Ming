import { RegisteredUser } from '@/types';

const STORAGE_KEY = 'yangming_registered_users';

export const INITIAL_MOCK_USERS: RegisteredUser[] = [
  {
    id: 'usr_ym_001',
    companyName: 'Evergreen Logistics Asia',
    email: 'ops@evergreen-asia.com',
    fileName: 'commercial_shipping_license_2026.pdf',
    fileType: 'application/pdf',
    fileSize: '2.4 MB',
    createdAt: '2026-10-18T09:30:00Z',
    status: 'Verified',
  },
  {
    id: 'usr_ym_002',
    companyName: 'Pacific Rim Freight & Cargo',
    email: 'maritime@pacific-rim-cargo.com',
    fileName: 'vessel_charter_agreement.pdf',
    fileType: 'application/pdf',
    fileSize: '1.8 MB',
    createdAt: '2026-10-19T14:15:00Z',
    status: 'Verified',
  },
  {
    id: 'usr_ym_003',
    companyName: 'Orient Harbor Transshipment Co.',
    email: 'contact@orient-harbor.tw',
    fileName: 'port_clearance_certificate.jpg',
    fileType: 'image/jpeg',
    fileSize: '3.1 MB',
    createdAt: '2026-10-20T11:45:00Z',
    status: 'Active',
  },
];

export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') {
    return INITIAL_MOCK_USERS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_USERS));
      return INITIAL_MOCK_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_MOCK_USERS;
  } catch (error) {
    console.error('Error reading registered users from localStorage:', error);
    return INITIAL_MOCK_USERS;
  }
}

export function saveRegisteredUser(
  newUser: Omit<RegisteredUser, 'id' | 'createdAt' | 'status'> & {
    id?: string;
    createdAt?: string;
    status?: RegisteredUser['status'];
  }
): RegisteredUser {
  const currentUsers = getRegisteredUsers();

  const userRecord: RegisteredUser = {
    id: newUser.id || `usr_ym_${Date.now()}`,
    companyName: newUser.companyName.trim(),
    email: newUser.email.trim().toLowerCase(),
    password: newUser.password,
    fileName: newUser.fileName,
    fileType: newUser.fileType,
    fileSize: newUser.fileSize,
    fileDataUrl: newUser.fileDataUrl,
    createdAt: newUser.createdAt || new Date().toISOString(),
    status: newUser.status || 'Verified',
  };

  const updatedUsers = [userRecord, ...currentUsers];

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      window.dispatchEvent(new Event('yangming_users_updated'));

      // Asynchronously sync to Supabase backend API route
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userRecord),
      }).catch((e) => console.log('Backend sync skipped:', e));
    } catch (err) {
      console.error('Error saving user to storage:', err);
    }
  }

  return userRecord;
}

export function deleteRegisteredUser(userId: string): RegisteredUser[] {
  const currentUsers = getRegisteredUsers();
  const updatedUsers = currentUsers.filter((u) => u.id !== userId);

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      window.dispatchEvent(new Event('yangming_users_updated'));
    } catch (err) {
      console.error('Error deleting user from storage:', err);
    }
  }

  return updatedUsers;
}

export function resetUsersToDefault(): RegisteredUser[] {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_USERS));
    window.dispatchEvent(new Event('yangming_users_updated'));
  }
  return INITIAL_MOCK_USERS;
}
