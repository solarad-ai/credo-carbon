# CredoCarbon Platform - User Documentation

## Overview

CredoCarbon is a comprehensive carbon credit management platform that enables project developers to register carbon offset projects, validators to verify emission reductions, registries to issue credits, and buyers to purchase and retire carbon credits.

---

## User Roles

| Role | Description |
|------|-------------|
| **Developer** | Creates and manages carbon offset projects |
| **Buyer** | Purchases and retires carbon credits |
| **VVB** | Validates and verifies projects |
| **Registry** | Reviews projects and issues credits |
| **Admin** | Manages platform operations |
| **SuperAdmin** | Full platform control |

---

## Table of Contents

1. [Developer Guide](#developer-guide)
2. [Buyer Guide](#buyer-guide)
3. [VVB Guide](#vvb-guide)
4. [Registry Guide](#registry-guide)
5. [Admin Guide](#admin-guide)
6. [SuperAdmin Guide](#superadmin-guide)

---

# Developer Guide

## Getting Started

### Registration
1. Navigate to `/developer/signup`
2. Fill in your details:
   - Email address
   - Password (min 8 characters)
   - Organization name
   - Country
3. Verify your email
4. Complete KYC verification

### Login
1. Go to `/developer/login`
2. Enter your email and password
3. Click "Log In"

## Dashboard Overview

After logging in, you'll see:
- **My Projects** - Summary of all your projects by status
- **Tasks Requiring Attention** - Pending actions needed
- **Recent Activity** - Latest project updates
- **Quick Actions** - Create new project, view credits

## Creating a Project

### Step 1: Project Type
Select your project category:
- Renewable Energy
- Energy Efficiency  
- Forestry/AFOLU
- Waste Management
- Industrial Processes

### Step 2: Basic Information
- Project Name
- Project Description
- Location (Country, Region)
- Expected Start Date
- Crediting Period

### Step 3: Generation Data
- Upload generation or emission reduction data
- Specify monitoring methodology
- Add baseline calculations

### Step 4: Stakeholder Consultation
- Upload consultation records
- Add meeting minutes
- Document community engagement

### Step 5: Compliance
- Social safeguards checklist
- Environmental safeguards checklist
- Add any supplementary documentation

### Step 6: Registry Submission
- Select target registry (GCC, VCS, Gold Standard)
- Generate required documents
- Submit for validation

## Carbon Credit Calculation

### Overview

Carbon credits represent verified emission reductions or removals. One carbon credit = 1 tonne of CO₂ equivalent (tCO₂e) reduced or removed from the atmosphere.

### Calculation Methodology

The platform uses approved methodologies from major registries (Gold Standard, VCS, ACR) to calculate emission reductions.

#### Basic Formula

```
Emission Reductions (ER) = Baseline Emissions (BE) - Project Emissions (PE) - Leakage (L)

Carbon Credits = ER × (1 - Buffer %) × Crediting Period
```

### Step-by-Step Calculation

#### 1. Baseline Emissions (BE)

**Definition**: Emissions that would occur without the project (business-as-usual scenario)

**For Renewable Energy Projects:**
```
BE = Electricity Generated (MWh) × Grid Emission Factor (tCO₂/MWh)
```

**Example - Solar Project:**
```
Annual Generation: 10,000 MWh
Grid Emission Factor: 0.82 tCO₂/MWh
BE = 10,000 × 0.82 = 8,200 tCO₂/year
```

**For Forestry Projects (A/R, REDD+):**
```
BE = Area (ha) × Carbon Stock Change (tCO₂/ha/year)
```

**For Energy Efficiency:**
```
BE = Energy Saved (MWh) × Fuel Emission Factor (tCO₂/MWh)
```

#### 2. Project Emissions (PE)

**Definition**: Emissions from project activities

**For Renewable Energy:**
```
PE = Construction Emissions + O&M Emissions + Grid Losses
```

Usually minimal (0-5% of baseline)

**For Forestry:**
```
PE = Harvesting + Transport + Processing Emissions
```

**Example:**
```
Construction: 100 tCO₂ (one-time)
Annual O&M: 50 tCO₂/year
Amortized over 25 years: (100/25) + 50 = 54 tCO₂/year
```

#### 3. Leakage (L)

**Definition**: Emissions that occur outside project boundary due to project activities

**Typical Leakage Rates:**
- Renewable Energy: 0-2%
- Forestry (A/R): 10-20%
- REDD+: 15-30%
- Energy Efficiency: 5-10%

**Example:**
```
Baseline Emissions: 8,200 tCO₂
Leakage Rate: 2%
L = 8,200 × 0.02 = 164 tCO₂/year
```

#### 4. Net Emission Reductions

```
ER = BE - PE - L
ER = 8,200 - 54 - 164 = 7,982 tCO₂/year
```

#### 5. Buffer Withholding

**Purpose**: Risk mitigation for non-permanence (mainly for forestry/land-use projects)

**Buffer Rates by Project Type:**
- Renewable Energy: 0%
- Energy Efficiency: 0%
- Forestry (A/R): 10-20%
- REDD+: 20-30%
- Biochar: 5-10%

**Example (Solar - No Buffer):**
```
Annual Credits = 7,982 × (1 - 0%) = 7,982 tCO₂e
```

**Example (Forestry - 15% Buffer):**
```
Annual Credits = 7,982 × (1 - 0.15) = 6,785 tCO₂e
```

#### 6. Crediting Period

**Total Credits Over Project Lifetime:**
```
Total Credits = Annual Credits × Crediting Period (years)
```

**Example:**
```
Annual Credits: 7,982 tCO₂e
Crediting Period: 10 years
Total Credits = 7,982 × 10 = 79,820 tCO₂e
```

### Project-Specific Calculations

#### Solar Energy Project

```
Input Data:
- Installed Capacity: 5 MW
- Capacity Factor: 20%
- Grid Emission Factor: 0.82 tCO₂/MWh
- Project Life: 25 years
- Crediting Period: 10 years

Calculation:
1. Annual Generation = 5,000 kW × 8,760 hours × 0.20 = 8,760 MWh
2. Baseline Emissions = 8,760 × 0.82 = 7,183 tCO₂/year
3. Project Emissions = ~50 tCO₂/year (O&M)
4. Leakage = 7,183 × 0.02 = 144 tCO₂/year
5. Net ER = 7,183 - 50 - 144 = 6,989 tCO₂/year
6. Buffer = 0% (renewable energy)
7. Annual Credits = 6,989 tCO₂e
8. 10-Year Credits = 6,989 × 10 = 69,890 tCO₂e
```

#### Afforestation/Reforestation (A/R)

```
Input Data:
- Area: 100 hectares
- Carbon Sequestration Rate: 10 tCO₂/ha/year
- Project Duration: 30 years
- Crediting Period: 20 years
- Buffer: 15%

Calculation:
1. Annual Sequestration = 100 × 10 = 1,000 tCO₂/year
2. Baseline = 0 (degraded land)
3. Project Emissions = 20 tCO₂/year (maintenance)
4. Leakage = 1,000 × 0.15 = 150 tCO₂/year
5. Net ER = 1,000 - 20 - 150 = 830 tCO₂/year
6. Buffer Withholding = 830 × 0.15 = 125 tCO₂/year
7. Annual Credits = 830 - 125 = 705 tCO₂e
8. 20-Year Credits = 705 × 20 = 14,100 tCO₂e
```

#### Wind Energy Project

```
Input Data:
- Installed Capacity: 10 MW
- Capacity Factor: 30%
- Grid Emission Factor: 0.75 tCO₂/MWh
- Crediting Period: 10 years

Calculation:
1. Annual Generation = 10,000 kW × 8,760 × 0.30 = 26,280 MWh
2. Baseline Emissions = 26,280 × 0.75 = 19,710 tCO₂/year
3. Project Emissions = 100 tCO₂/year
4. Leakage = 19,710 × 0.02 = 394 tCO₂/year
5. Net ER = 19,710 - 100 - 394 = 19,216 tCO₂/year
6. Annual Credits = 19,216 tCO₂e
7. 10-Year Credits = 192,160 tCO₂e
```

### Monitoring & Verification

#### Annual Monitoring

Projects must monitor and report actual performance annually:

1. **Actual Generation/Activity Data**
   - Meter readings
   - Satellite imagery (forestry)
   - Field measurements

2. **Recalculation**
   ```
   Actual Credits = Actual Performance × Emission Factor × (1 - Buffer%)
   ```

3. **Adjustments**
   - If actual < projected: Credits reduced
   - If actual > projected: Additional credits issued

#### Verification Process

1. **VVB Review**
   - Verify monitoring data
   - Validate calculations
   - Check methodology compliance

2. **Verified Emission Reductions (VERs)**
   ```
   VERs = Verified Annual ER × Monitoring Period
   ```

3. **Credit Issuance**
   - Registry reviews VVB report
   - Issues credits to project account
   - Credits become tradeable

### Key Factors Affecting Credit Quantity

| Factor | Impact | Typical Range |
|--------|--------|---------------|
| **Grid Emission Factor** | Higher = More credits | 0.3-1.2 tCO₂/MWh |
| **Project Efficiency** | Higher = More credits | 15-95% |
| **Leakage Rate** | Higher = Fewer credits | 0-30% |
| **Buffer Percentage** | Higher = Fewer credits | 0-30% |
| **Monitoring Period** | Longer = More credits | 1-30 years |
| **Baseline Scenario** | Conservative = Fewer credits | Varies |

### Additionality Requirement

**Critical**: Projects must prove they wouldn't happen without carbon finance.

**Tests:**
1. **Investment Analysis**: Project not financially viable without carbon revenue
2. **Barrier Analysis**: Significant barriers overcome by carbon finance
3. **Common Practice**: Project not common practice in region

**Impact on Credits:**
- If additionality not proven: **0 credits** (project rejected)
- If proven: Full credits as calculated

### Platform Tools

The CredoCarbon platform provides:

1. **Credit Calculator**
   - Input project parameters
   - Auto-calculates expected credits
   - Compares methodologies

2. **Baseline Database**
   - Grid emission factors by country
   - Default leakage rates
   - Buffer percentages by project type

3. **Monitoring Dashboard**
   - Track actual vs. projected
   - Automatic recalculation
   - Variance alerts

4. **Verification Support**
   - Pre-filled monitoring reports
   - Data validation
   - VVB collaboration tools

### Example: Complete Project Calculation

**Project**: 50 MW Solar Farm in India

```
Step 1: Project Data
- Capacity: 50 MW
- Capacity Factor: 19% (India average)
- Location: Maharashtra
- Grid Emission Factor: 0.82 tCO₂/MWh (CEA data)
- Crediting Period: 10 years

Step 2: Annual Generation
= 50,000 kW × 8,760 hours × 0.19
= 83,220 MWh/year

Step 3: Baseline Emissions
= 83,220 MWh × 0.82 tCO₂/MWh
= 68,240 tCO₂/year

Step 4: Project Emissions
- Construction (amortized): 200 tCO₂/year
- O&M: 150 tCO₂/year
- Total PE = 350 tCO₂/year

Step 5: Leakage (2%)
= 68,240 × 0.02
= 1,365 tCO₂/year

Step 6: Net Emission Reductions
= 68,240 - 350 - 1,365
= 66,525 tCO₂/year

Step 7: Buffer (0% for renewable)
= 0 tCO₂/year

Step 8: Annual Credits
= 66,525 tCO₂e/year

Step 9: Total Credits (10 years)
= 66,525 × 10
= 665,250 tCO₂e

Step 10: Market Value (at $15/credit)
= 665,250 × $15
= $9,978,750
```

### Tips for Maximizing Credits

1. **Choose High-Impact Locations**
   - Higher grid emission factors = more credits
   - Countries with coal-heavy grids preferred

2. **Optimize Project Design**
   - Maximize efficiency
   - Minimize project emissions
   - Use proven technology

3. **Conservative Baseline**
   - Use approved methodologies
   - Document assumptions
   - Avoid over-estimation

4. **Robust Monitoring**
   - Accurate data collection
   - Regular calibration
   - Third-party verification

5. **Long Crediting Periods**
   - Maximize total credits
   - Balance with technology life
   - Consider market trends

### Common Mistakes to Avoid

❌ **Over-estimating baseline** - Leads to rejection
❌ **Ignoring leakage** - Credits will be reduced
❌ **Poor monitoring** - Verification issues
❌ **Wrong methodology** - Project may not qualify
❌ **Inadequate additionality proof** - Project rejected

✅ **Use platform calculator** - Accurate estimates
✅ **Follow approved methodologies** - Ensure compliance
✅ **Document everything** - Smooth validation
✅ **Engage VVB early** - Avoid issues later



## Project Lifecycle

```
DRAFT → SUBMITTED_TO_VVB → VALIDATION_PENDING → VALIDATION_APPROVED 
→ VERIFICATION_PENDING → VERIFICATION_APPROVED → REGISTRY_REVIEW → ISSUED
```

## Managing Credits

Once credits are issued:
- View in **Portfolio**
- List for sale in **Marketplace**
- Track retirements
- View transaction history

---

# Buyer Guide

## Getting Started

### Registration
1. Navigate to `/buyer/signup`
2. Complete registration form
3. Verify email
4. Complete KYC (Individual or Corporate)

### Login
1. Go to `/buyer/login`
2. Enter credentials
3. Access your dashboard

## Dashboard Overview

- **Portfolio Summary** - Your credit holdings
- **Recent Purchases** - Transaction history
- **Active Orders** - Pending buy orders
- **Market Insights** - Credit pricing trends

## Browsing Credits

### Marketplace
1. Go to **Marketplace**
2. Filter by:
   - Project Type
   - Vintage Year
   - Price Range
   - Registry
   - Location
3. View credit details
4. Add to cart or buy directly

## Purchasing Credits

1. Select credits from marketplace
2. Review purchase details
3. Confirm payment method
4. Complete transaction
5. Credits appear in Portfolio

## Retiring Credits

1. Go to **Portfolio**
2. Select credits to retire
3. Enter retirement details:
   - Beneficiary name
   - Retirement purpose
   - Date
4. Confirm retirement
5. Receive retirement certificate

## Wallet & Payments

- View balance
- Add funds
- Track transactions
- Withdraw funds

---

# VVB Guide

## Getting Started

VVB accounts are created by SuperAdmin. Contact your administrator for access.

### Login
1. Navigate to `/vvb/login`
2. Enter your credentials
3. Access VVB dashboard

## Dashboard Overview

- **Pending Validations** - New projects awaiting validation
- **In Progress Validations** - Projects you're currently validating
- **Pending Verifications** - Monitoring periods to verify
- **Open Queries** - Questions awaiting developer response

## Validation Workflow

### Receiving an Assignment
Projects are assigned by Admin/SuperAdmin. You'll receive a notification when assigned.

### Conducting Validation

1. Go to **Projects** → Select project
2. Review project documentation:
   - Project Description Document
   - Baseline calculations
   - Monitoring plan
   - Stakeholder records

3. Complete validation checklist:
   - [ ] Methodology appropriate
   - [ ] Boundaries correctly defined
   - [ ] Additionality demonstrated
   - [ ] Baseline conservative
   - [ ] Emission calculations correct
   - [ ] Monitoring plan adequate
   - [ ] Safeguards addressed
   - [ ] Stakeholder consultation complete
   - [ ] Documentation complete
   - [ ] Regulatory compliance verified

4. Raise queries if clarification needed
5. Update status and add remarks
6. Submit decision (Approve/Reject)

## Verification Workflow

### Verifying Emission Reductions

1. Go to **Verifications** → Select verification task
2. Review monitoring data
3. Verify claimed reductions:
   - Check data collection methods
   - Validate calculations
   - Apply adjustments if needed
   - Account for leakage
   - Calculate buffer percentage

4. Complete verification checklist
5. Enter verified emission reductions
6. Submit verification report

## Query Management

### Raising Queries
1. Go to query section within task
2. Select category (Methodology, Documentation, etc.)
3. Write your question
4. Submit query

### Reviewing Responses
1. Check **Queries** page for developer responses
2. Review attached documents
3. Mark as resolved or request more info

---

# Registry Guide

## Getting Started

Registry accounts are created by SuperAdmin. Contact your administrator for access.

### Login
1. Navigate to `/registry/login`
2. Enter credentials
3. Access Registry dashboard

## Dashboard Overview

- **Pending Reviews** - VVB-approved projects awaiting review
- **In Progress Reviews** - Active reviews
- **Pending Issuances** - Approved projects ready for credit issuance
- **Total Credits Issued** - Platform statistics

## Review Workflow

### Conducting Registry Review

1. Go to **Projects** → Select project
2. Review validation/verification reports
3. Complete review checklist:
   - [ ] Methodology approved for registry
   - [ ] Validation report complete
   - [ ] Verification report complete
   - [ ] Credit calculation verified
   - [ ] Additionality confirmed
   - [ ] Safeguards verified
   - [ ] Documentation complete
   - [ ] Fees paid
   - [ ] Registry requirements met
   - [ ] Ready for issuance

4. Add conditions (if any)
5. Submit decision:
   - **Approve** - Ready for issuance
   - **Approve with Conditions** - Minor issues to address
   - **Reject** - Major issues, provide reason

## Credit Issuance

### Issuing Credits

1. Go to **Issuances**
2. Select approved project
3. Enter issuance details:
   - Registry Reference ID
   - Credit quantity
   - Vintage year
   - Serial number range
4. Upload certificate
5. Confirm issuance
6. Credits are created and assigned to developer

## Credit Management

### Viewing Issued Credits
1. Go to **Credits**
2. View all credit batches
3. Track:
   - Available credits
   - Sold credits
   - Retired credits

---

# Admin Guide

## Getting Started

Admin accounts are created by SuperAdmin.

### Login
1. Navigate to `/admin/login`
2. Enter credentials
3. Access Admin dashboard

## Dashboard Features

### User Management
- View all platform users
- Filter by role, status
- Edit user details
- Activate/Deactivate accounts

### Project Oversight
- View all projects
- Monitor project status
- Assign VVBs to projects
- Track project milestones

### Transaction Monitoring
- View marketplace transactions
- Monitor credit transfers
- Track retirements
- Generate reports

### Support
- Respond to user queries
- Manage support tickets
- Send notifications

---

# SuperAdmin Guide

## Getting Started

SuperAdmin is the highest privilege level with full platform control.

### Login
1. Navigate to `/superadmin/login`
2. Enter credentials
3. Access SuperAdmin console

## Dashboard Overview

- Platform statistics (users, projects, credits, transactions)
- System health monitoring
- Recent activity feed
- Quick actions

## User Management

### Creating Users

#### Create Admin
```
POST /api/superadmin/admins
{
  "email": "admin@example.com",
  "password": "SecurePass123",
  "name": "Admin Name",
  "organization": "CredoCarbon"
}
```

#### Create VVB User
```
POST /api/superadmin/vvb-users
{
  "email": "vvb@example.com",
  "password": "SecurePass123",
  "name": "VVB Auditor",
  "organization": "VVB Organization"
}
```

#### Create Registry User
```
POST /api/superadmin/registry-users
{
  "email": "registry@example.com",
  "password": "SecurePass123",
  "name": "Registry Officer",
  "organization": "Carbon Registry"
}
```

### Managing Users
- View all users: `/superadmin/dashboard/users`
- Edit user details
- Deactivate accounts
- Change roles

## Platform Configuration

### Registries
- Add new registries
- Configure registry settings
- Enable/disable registries

### Project Types
- Add project categories
- Configure validation rules
- Set buffer percentages

### Feature Flags
- Enable/disable platform features
- Control beta features
- A/B testing configuration

### Platform Fees
- Set transaction fees
- Configure fee structure
- View fee reports

### Email Templates
- Customize notification emails
- Edit welcome messages
- Configure system alerts

## Monitoring

### Audit Logs
- View all system actions
- Filter by user, action type
- Export for compliance

### API Health
- Monitor endpoint status
- View error rates
- Check database connections

### Analytics
- User growth trends
- Credit issuance trends
- Transaction volumes
- Revenue reports

---

## API Endpoints Reference

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/developer/login` | POST | Developer login |
| `/api/auth/buyer/login` | POST | Buyer login |
| `/api/auth/vvb/login` | POST | VVB login |
| `/api/auth/registry/login` | POST | Registry login |
| `/api/auth/admin/login` | POST | Admin login |
| `/api/auth/superadmin/login` | POST | SuperAdmin login |

### VVB Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/vvb/dashboard/stats` | GET | Dashboard statistics |
| `/api/vvb/dashboard/projects` | GET | Assigned projects |
| `/api/vvb/validations/{id}` | GET/PUT | Validation task |
| `/api/vvb/verifications/{id}` | GET/PUT | Verification task |
| `/api/vvb/queries` | GET/POST | Query management |

### Registry Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/registry/dashboard/stats` | GET | Dashboard statistics |
| `/api/registry/dashboard/projects` | GET | Projects for review |
| `/api/registry/reviews/{id}` | GET/PUT | Review details |
| `/api/registry/issuances` | GET/POST | Credit issuances |
| `/api/registry/credits` | GET | Issued credits |

---

## Support

For technical support:
- Email: support@credocarbon.com
- Documentation: https://docs.credocarbon.com
- Status Page: https://status.credocarbon.com
