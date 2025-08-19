# SecureID

A modern, decentralized password manager and two-factor authentication (2FA) system built on the Internet Computer Protocol (ICP). SecureID provides secure, encrypted storage for passwords, TOTP codes, and sensitive notes with a beautiful, responsive user interface.

## 🚀 Features

### 🔐 Password Management
- **Secure Storage**: AES-256 client-side encryption
- **Password Generation**: Built-in secure password generator
- **Strength Analysis**: Real-time password strength assessment
- **Breach Detection**: Compromised password alerts
- **Organization**: Folders and tags for easy management

### 📱 TOTP Authenticator
- **2FA Support**: Generate time-based one-time passwords
- **Multiple Algorithms**: SHA1, SHA256, SHA512 support
- **Flexible Configuration**: 6 or 8 digit codes, custom periods
- **Real-time Updates**: Live countdown timers
- **Secure Backup**: Encrypted secret key storage

### 📝 Secure Notes
- **Encrypted Storage**: Store sensitive information securely
- **Rich Content**: Support for long-form text content
- **Organization**: Folders and tags for categorization
- **Search**: Full-text search across all notes
- **Access Tracking**: Monitor when notes were accessed

### 🛡️ Security Features
- **Internet Identity**: Passwordless authentication using ICP
- **Client-side Encryption**: Data encrypted before leaving your device
- **Decentralized Storage**: Data stored on the Internet Computer blockchain
- **VetKD Integration**: Verifiable Encrypted Threshold Key Derivation
- **Zero-Knowledge**: Backend never sees your plaintext data

### 🎨 Modern UI/UX
- **Beautiful Design**: Modern, clean interface using Tailwind CSS
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Works seamlessly on desktop and mobile
- **Accessibility**: Built with accessibility in mind
- **Animations**: Smooth transitions and loading states

## 🛠️ Technical Stack

### Backend (Motoko)
- **Language**: Motoko
- **Runtime**: Internet Computer Protocol (ICP)
- **Storage**: Stable memory with upgrade safety
- **Encryption**: Client-side AES-256-GCM
- **Authentication**: Internet Identity integration

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: Wouter (lightweight routing)
- **State Management**: React Context API
- **Crypto**: Web Crypto API for client-side encryption
- **TOTP**: OTPAuth library for code generation
- **Build Tool**: Vite for fast development

## 🏗️ Architecture

### Data Flow
1. **Authentication**: User signs in with Internet Identity
2. **Key Generation**: Unique encryption key derived from user's principal
3. **Client Encryption**: All sensitive data encrypted locally
4. **Secure Storage**: Encrypted data stored on ICP canister
5. **Retrieval**: Data fetched and decrypted client-side

### Security Model
- **End-to-End Encryption**: Data encrypted before transmission
- **Key Derivation**: VetKD for secure key management
- **Access Control**: Principal-based ownership verification
- **Audit Trail**: Timestamps for creation, updates, and access

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- DFX SDK (Internet Computer development kit)
- Internet Identity canister (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SecureID
   ```

2. **Install dependencies**
   ```bash
   # Install Motoko dependencies
   mops install
   
   # Install frontend dependencies
   cd src/SecureID_frontend
   npm install
   cd ../..
   ```

3. **Start local Internet Computer replica**
   ```bash
   dfx start --clean
   ```

4. **Deploy Internet Identity canister**
   ```bash
   dfx deploy internet_identity
   ```

5. **Deploy SecureID canisters**
   ```bash
   dfx deploy
   ```

6. **Start the frontend development server**
   ```bash
   cd src/SecureID_frontend
   npm start
   ```

### Development Workflow

1. **Start the local replica**
   ```bash
   dfx start
   ```

2. **Deploy changes**
   ```bash
   dfx deploy
   ```

3. **Generate type definitions**
   ```bash
   dfx generate
   ```

4. **Build for production**
   ```bash
   cd src/SecureID_frontend
   npm run build
   ```

## 📖 Usage Guide

### First Time Setup
1. Navigate to the SecureID application
2. Click "Sign in with Internet Identity"
3. Create or use existing Internet Identity
4. Complete authentication flow
5. Start adding passwords, TOTP codes, and notes

### Managing Passwords
- **Add Password**: Click "Add Password" and fill in details
- **Generate Password**: Use the shuffle button for secure generation
- **Edit Password**: Click edit icon on any password card
- **Copy Password**: Click copy icon to copy to clipboard
- **Search**: Use search bar to find specific passwords
- **Organize**: Use folders and tags for organization

### Setting up TOTP
- **Add TOTP**: Click "Add TOTP" and enter secret key
- **Manual Entry**: Enter details manually or scan QR code
- **View Codes**: Live codes update every 30 seconds
- **Copy Code**: Click copy to copy current code
- **Backup**: Secret keys are encrypted and stored securely

### Secure Notes
- **Create Note**: Click "Add Note" and enter content
- **Rich Content**: Support for multi-line text and formatting
- **Search**: Full-text search across all notes
- **Tags**: Use tags for categorization
- **Folders**: Organize notes into folders

## 🔧 Configuration

### Environment Variables
- `DFX_NETWORK`: Network type (local/ic)
- `CANISTER_ID_SECUREID_BACKEND`: Backend canister ID
- `CANISTER_ID_SECUREID_FRONTEND`: Frontend canister ID
- `CANISTER_ID_INTERNET_IDENTITY`: Internet Identity canister ID

### Settings
- **Theme**: Light/Dark mode toggle
- **Auto-lock**: Automatic session timeout
- **Clipboard**: Auto-clear copied passwords
- **Security**: Password strength indicators

## 🧪 Testing

### Unit Tests
```bash
# Run backend tests
dfx test

# Run frontend tests
cd src/SecureID_frontend
npm test
```

### Manual Testing
1. Test authentication flow
2. Verify password operations (CRUD)
3. Test TOTP code generation
4. Verify encryption/decryption
5. Test responsive design

## 🚀 Deployment

### Local Deployment
```bash
dfx deploy --network local
```

### IC Mainnet Deployment
```bash
dfx deploy --network ic
```

### Frontend Deployment
```bash
cd src/SecureID_frontend
npm run build
dfx deploy SecureID_frontend --network ic
```
## Contact
For any questions, please reach out at [dienvophong18@gmail.com] or open an issue.

**SecureID** - Your secure, decentralized password manager on the Internet Computer.

Built with ❤️ for the ICP ecosystem.
