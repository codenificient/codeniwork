# Passkey Authentication & Master Password Implementation

This document outlines the implementation of passkey authentication and master password encryption for the CodeniWork application.

## Overview

The implementation includes:

- **Passkey Authentication**: WebAuthn-based passwordless authentication
- **Master Password Encryption**: Client-side encryption for sensitive data
- **Multi-step Registration**: Enhanced registration flow with security setup
- **Backward Compatibility**: Existing email/password authentication still works

## Architecture

### Database Schema Changes

#### Users Table Extensions

```sql
ALTER TABLE users
ADD COLUMN master_password_hash TEXT,
ADD COLUMN master_password_salt TEXT,
ADD COLUMN encryption_key_derivation_salt TEXT;
```

#### New Passkey Credentials Table

```sql
CREATE TABLE passkey_credentials (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  credential_id TEXT UNIQUE NOT NULL,
  public_key TEXT NOT NULL,
  counter TEXT DEFAULT '0',
  device_type TEXT,
  backed_up BOOLEAN DEFAULT false,
  transports TEXT, -- JSON array
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_used TIMESTAMP
);
```

### Core Components

#### 1. Passkey Authentication Library (`lib/passkey-auth.ts`)

- WebAuthn credential creation and verification
- Challenge generation and validation
- Master password hashing and encryption utilities
- PBKDF2-based key derivation

#### 2. Client-side Hook (`hooks/use-passkey-auth.ts`)

- WebAuthn API integration
- Base64URL encoding/decoding utilities
- Registration and authentication flows
- Master password management

#### 3. API Routes

- `/api/auth/passkey/register/options` - Generate registration options
- `/api/auth/passkey/register/verify` - Verify registration response
- `/api/auth/passkey/authenticate/options` - Generate authentication options
- `/api/auth/passkey/authenticate/verify` - Verify authentication response
- `/api/auth/master-password/setup` - Setup master password
- `/api/auth/master-password/verify` - Verify master password
- `/api/auth/passkey/list` - List user's passkeys
- `/api/auth/passkey/[id]` - Delete specific passkey

## Registration Flow

### Step 1: Basic Information

- User provides name, email, and password
- Account is created in the database
- User ID is returned for subsequent steps

### Step 2: Master Password Setup

- User creates a strong master password (minimum 12 characters)
- Password is hashed using PBKDF2 with a unique salt
- Encryption key derivation salt is generated and stored
- Master password hash and salts are stored in the database

### Step 3: Passkey Registration (Optional)

- Browser compatibility is checked
- WebAuthn registration options are generated
- User authenticates with their device (biometrics/PIN)
- Credential is verified and stored in the database
- User can skip this step and add passkeys later

## Authentication Flow

### Passkey Authentication

1. User clicks "Sign In with Passkey"
2. Authentication options are generated
3. User authenticates with their device
4. Credential is verified against stored public key
5. User is signed in via NextAuth

### Email/Password Authentication

- Traditional flow remains unchanged
- Backward compatible with existing accounts

## Master Password Encryption

### Key Derivation

```typescript
// Derive encryption key from master password
const key = await deriveEncryptionKey(masterPassword, salt);

// Encrypt sensitive data
const { encrypted, iv } = encryptData(sensitiveData, key);

// Decrypt data
const decrypted = decryptData(encrypted, key, iv);
```

### Usage

- Sensitive data (notes, documents) can be encrypted before storage
- Master password is required to decrypt data
- Encryption happens client-side for maximum security

## Security Features

### Passkey Security

- **Phishing Resistant**: Credentials are bound to the origin
- **Unphishable**: Private keys never leave the device
- **Biometric Protection**: Uses device's secure authentication
- **No Shared Secrets**: Public key cryptography eliminates password breaches

### Master Password Security

- **PBKDF2 Key Derivation**: 100,000 iterations with unique salts
- **AES-256-CBC Encryption**: Industry-standard encryption
- **Client-side Encryption**: Master password never sent to server
- **Unique Salts**: Each user has unique encryption and password salts

### Additional Security Measures

- **Challenge-Response**: Prevents replay attacks
- **Origin Validation**: Ensures requests come from the correct domain
- **Counter Validation**: Prevents credential reuse
- **Secure Storage**: Credentials stored with proper indexing and constraints

## Browser Compatibility

### Supported Browsers

- Chrome 67+ (Desktop & Mobile)
- Firefox 60+ (Desktop & Mobile)
- Safari 14+ (Desktop & Mobile)
- Edge 18+ (Desktop & Mobile)

### Fallback Behavior

- Graceful degradation to email/password authentication
- Clear messaging when passkeys are not supported
- Progressive enhancement approach

## Usage Examples

### Register a New Passkey

```typescript
const { registerPasskey } = usePasskeyAuth();

try {
  const result = await registerPasskey("user@example.com", "User Name");
  console.log("Passkey registered:", result.credentialId);
} catch (error) {
  console.error("Registration failed:", error.message);
}
```

### Authenticate with Passkey

```typescript
const { authenticateWithPasskey } = usePasskeyAuth();

try {
  const result = await authenticateWithPasskey();
  if (result.verified) {
    // User authenticated successfully
    console.log("User:", result.user);
  }
} catch (error) {
  console.error("Authentication failed:", error.message);
}
```

### Setup Master Password

```typescript
const { setupMasterPassword } = usePasskeyAuth();

try {
  await setupMasterPassword("my-strong-master-password");
  console.log("Master password setup complete");
} catch (error) {
  console.error("Setup failed:", error.message);
}
```

## Migration Guide

### For Existing Users

1. Existing accounts continue to work with email/password
2. Users can optionally add passkeys in their profile
3. Users can optionally setup master password for encryption
4. No breaking changes to existing functionality

### Database Migration

Run the migration script to add new tables and columns:

```bash
npm run db:migrate
# or
tsx scripts/add-passkey-support.ts
```

## Future Enhancements

### Planned Features

- **Conditional UI**: Show passkey options only for supported browsers
- **Device Management**: Better naming and management of passkeys
- **Backup Codes**: Recovery options for lost passkeys
- **Enterprise Features**: Admin management of passkeys
- **Cross-device Sync**: Passkey synchronization across devices

### Security Improvements

- **Attestation Verification**: Verify authenticator attestation
- **Risk Assessment**: Analyze authentication patterns
- **Audit Logging**: Track passkey usage and security events
- **Rate Limiting**: Prevent brute force attacks

## Troubleshooting

### Common Issues

1. **Passkey not working**: Check browser compatibility
2. **Registration fails**: Ensure HTTPS and valid origin
3. **Authentication timeout**: Increase timeout in configuration
4. **Master password forgotten**: No recovery possible (by design)

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG_PASSKEY=true
```

## Dependencies

### Added Packages

- `@codenificient/passkey-auth`: Custom passkey authentication library
- Built-in Node.js `crypto` module for encryption

### Browser APIs Used

- `navigator.credentials.create()`: Create passkey
- `navigator.credentials.get()`: Authenticate with passkey
- `crypto.subtle`: For client-side cryptographic operations

## Conclusion

This implementation provides a modern, secure authentication system while maintaining backward compatibility. Users can choose between traditional passwords and modern passkeys, with optional master password encryption for sensitive data.

The system is designed to be:

- **Secure**: Industry-standard cryptography and best practices
- **User-friendly**: Simple, intuitive flows
- **Future-proof**: Built on web standards
- **Scalable**: Supports multiple passkeys per user
- **Maintainable**: Clean, well-documented code


