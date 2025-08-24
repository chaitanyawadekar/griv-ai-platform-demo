# Griv AI Platform - Web Demo

🎯 **Complete web-based demo of the Griv AI omni-channel operations automation platform**

## 🌐 Live Demo

**🔗 [View Live Demo](https://web-demo-bgro0ul3l-chaitanyas-projects-9ea51a2a.vercel.app)**

## 📂 Repository

**📁 GitHub Repository:** [chaitanyawadekar/griv-ai-platform-demo](https://github.com/chaitanyawadekar/griv-ai-platform-demo)

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/chaitanyawadekar/griv-ai-platform-demo.git
cd griv-ai-platform-demo

# Install dependencies
npm install

# Start development server
npm start

# Open browser at http://localhost:3000
```

## 🎨 Features Included

### **Core Modules**
- 📊 **Dashboard** - Real-time analytics and statistics
- 📝 **Workitems** - Lead, Task, Grievance management
- 👥 **Contacts** - Customer, Voter, Influencer database
- 🔄 **Workflows** - Visual automation builder
- 🤖 **AI Assistant** - Integrated chat interface
- ⚙️ **Settings** - Complete configuration management

### **UI/UX Features**
- 🎨 **ShadCN Design System** - Modern, clean interface
- 🎯 **Orange Theme** - Consistent branding
- 📱 **Responsive Layout** - Mobile-first design
- 🔄 **Interactive Modals** - Smooth popup interactions
- 👤 **User Menu** - Dropdown navigation
- 🌙 **Dark Mode Ready** - Theme infrastructure

### **Functionality**
- ✅ **Dynamic Type Management** - Customize workitem and contact types
- ✅ **Field Configuration** - Add/remove custom fields per type
- ✅ **SOP Builder** - Create step-by-step procedures
- ✅ **Workflow Steps** - Multi-action automation chains
- ✅ **Token Management** - AI usage tracking (25,000 tokens)
- ✅ **Team Management** - Complete employee management system
- ✅ **Multi-tenant Support** - Organization switching capability
- ✅ **Permission System** - READ, WRITE, DELETE, ADMIN access levels
- ✅ **Department Structure** - Team organization and hierarchy
- ✅ **Interactive Modals** - Fully functional add/edit employee popups
- ✅ **Settings Integration** - Comprehensive configuration management

## 📂 Project Structure

```
web-demo/
├── src/
│   ├── App.tsx           # Main application (4100+ lines)
│   ├── App.css           # Styles
│   └── index.tsx         # Entry point
├── public/
│   └── index.html        # HTML template
└── package.json          # Dependencies
```

## 🖥️ Screens Overview

### **1. Login Screen**
- Phone number authentication
- Clean, minimal design
- Auto-login for demo

### **2. Dashboard**
- Workitem statistics
- Contact metrics
- Workflow performance
- Token usage display
- Recent activities

### **3. Workitems Management**
- Create new workitems
- Filter by type/status/priority
- Assign to team members
- Apply SOPs
- Bulk actions

### **4. Contact Management**
- Add contacts with custom fields
- Type-based categorization
- Communication history
- Activity tracking
- Import/export

### **5. Workflow Builder**
- Visual workflow designer
- Trigger configuration
- Multi-step actions
- Conditional logic
- Template library

### **6. AI Assistant**
- Chat interface
- Context-aware responses
- Token usage tracking
- Message history
- Quick actions

### **7. Settings**
Comprehensive multi-page settings with:
- **General** - Company info, timezone, preferences
- **Field Configuration** - Custom fields for workitems/contacts
- **Workflows** - Automation builder and management
- **SOPs** - Standard operating procedures
- **Team Management** - Employee management with ACL permissions
  - **Employees** - Add, edit, assign permissions
  - **Departments** - Team organization structure  
  - **Permissions** - READ, WRITE, DELETE, ADMIN levels
- **Integrations** - WhatsApp, SMS, Email, Voice APIs
- **Notifications** - Alert preferences
- **Security** - Access control and data protection
- **Billing** - Plan management and usage tracking

## 🎯 Key Components

### **Modal System**
```typescript
<Modal show={showModal} onClose={() => setShowModal(false)} title="Title">
  {/* Modal content */}
</Modal>
```

### **Icon Component**
```typescript
<Icon name="dashboard" size={20} color="#000" />
```

### **Card Component**
```typescript
<div style={{
  background: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: '12px',
  padding: '1.5rem'
}}>
  {/* Card content */}
</div>
```

## 🎨 Theme Configuration

```typescript
const theme = {
  colors: {
    background: '#f8fafc',
    foreground: '#0f172a',
    card: '#ffffff',
    primary: 'rgb(234, 88, 12)', // Orange
    primaryForeground: '#ffffff',
    secondary: '#f8fafc',
    border: '#e2e8f0',
    success: '#22c55e',
    destructive: '#ef4444',
    mutedForeground: '#64748b'
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
  }
}
```

## 🔄 State Management

The demo uses React's built-in state management:
- `useState` for component state
- `useEffect` for side effects
- Props drilling for data flow
- Local state for modals

## 🚀 Deployment

### **Production Deployment**
- **Platform**: Vercel
- **Live URL**: [https://web-demo-bgro0ul3l-chaitanyas-projects-9ea51a2a.vercel.app](https://web-demo-bgro0ul3l-chaitanyas-projects-9ea51a2a.vercel.app)
- **Auto-Deploy**: Enabled from `master` branch
- **Build Command**: `react-scripts build`
- **Framework**: React (Create React App)

### **Repository Integration**
- **GitHub**: [chaitanyawadekar/griv-ai-platform-demo](https://github.com/chaitanyawadekar/griv-ai-platform-demo)
- **Branch**: `master`
- **Auto-Deploy**: Every push triggers automatic deployment

## 📝 Recent Updates

### **August 2024 - v2.0**
- ✅ **ShadCN Design System Implementation** - Replaced emoji icons with professional SVG icons
- ✅ **Complete Griv AI Platform Rebuild** - Full-featured demo application
- ✅ **Production Deployment** - Live on Vercel with auto-deploy from GitHub
- ✅ **Repository Migration** - Moved to chaitanyawadekar/griv-ai-platform-demo
- ✅ **Professional Icon System** - Clean, scalable SVG icons following ShadCN patterns
- ✅ **Complete Team Management System** - Employee management with ACL permissions
- ✅ **Add/Edit Employee Modals** - Full employee lifecycle management
- ✅ **Multi-tenant Organization Switching** - Organization selector in header
- ✅ **Enhanced Settings UX** - Comprehensive multi-page settings interface
- ✅ **TypeScript Error Resolution** - Fixed all compilation errors
- ✅ **User Menu Integration** - Settings navigation from dropdown
- ✅ **AI Chat Modal** - Floating AI assistant button with overlay
- ✅ **Workflow Integration** - Moved workflows to settings section
- ✅ **Permission System** - READ, WRITE, DELETE, ADMIN access levels
- ✅ **Department Management** - Team organization structure
- ✅ **Interactive Components** - All modals and popups fully functional

## 🛠️ Development

### **Available Scripts**
```bash
npm start       # Start development server
npm build       # Create production build
npm test        # Run tests
npm eject       # Eject from CRA (not recommended)
```

### **Environment Variables**
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
```

### **Code Style**
- TypeScript for type safety
- Inline styles for components
- Theme object for consistency
- Functional components with hooks
- Clear naming conventions

## 🚦 Testing Checklist

### **Navigation**
- [ ] All menu items navigate correctly
- [ ] User dropdown works
- [ ] Token display is visible

### **Modals**
- [x] Create Workitem modal
- [x] Create Contact modal
- [x] Create Workflow modal
- [x] Field Configuration modal
- [x] SOP Configuration modal
- [x] Type Management modals
- [x] Add Employee modal
- [x] Edit Employee modal
- [x] AI Chat modal overlay

### **Forms**
- [ ] Input validation works
- [ ] Submit buttons function
- [ ] Cancel closes modals
- [ ] Data persists in state

### **Responsive**
- [ ] Mobile view (< 768px)
- [ ] Tablet view (768px - 1024px)
- [ ] Desktop view (> 1024px)

## 🐛 Known Issues

1. **State Persistence** - Data resets on page refresh (use localStorage for persistence)
2. **API Integration** - Currently using mock data (ready for backend integration)
3. **Performance** - Large file (~4100+ lines) could benefit from code splitting
4. **ESLint Warnings** - Some unused variables remain (development only)

## 🔮 Future Enhancements

- Component extraction for reusability
- Redux/Context for state management
- API integration with backend
- Real-time updates with WebSocket
- Unit and integration tests
- Storybook for component documentation
- PWA capabilities
- Offline support

## 🔗 Links

- **🌐 Live Demo**: [https://web-demo-bgro0ul3l-chaitanyas-projects-9ea51a2a.vercel.app](https://web-demo-bgro0ul3l-chaitanyas-projects-9ea51a2a.vercel.app)
- **📁 GitHub Repository**: [https://github.com/chaitanyawadekar/griv-ai-platform-demo](https://github.com/chaitanyawadekar/griv-ai-platform-demo)
- **🚀 Vercel Dashboard**: [https://vercel.com/chaitanyas-projects-9ea51a2a/web-demo](https://vercel.com/chaitanyas-projects-9ea51a2a/web-demo)

## 📚 Resources

- [React Documentation](https://reactjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Create React App](https://create-react-app.dev/)
- [Vercel Documentation](https://vercel.com/docs)

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ by [Chaitanya Wadekar](https://github.com/chaitanyawadekar)**

**Powered by Griv AI Platform • React • TypeScript • ShadCN • Vercel**