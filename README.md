# GearGuard – Smart Maintenance Management Module

## Overview

**GearGuard** is a structured maintenance management module designed to help organizations track assets, assign responsibility, and manage corrective and preventive maintenance workflows.

This module is built with a **database-first, workflow-driven approach**, following ERP principles rather than rapid-prototype shortcuts. The focus is on clean data modeling, modular logic, and real-world operational behavior.

---

## Core Philosophy

GearGuard is built around three tightly connected but clearly separated entities:

- **Equipment** – What needs maintenance  
- **Maintenance Teams** – Who is responsible  
- **Maintenance Requests** – The work being performed  

Each entity has a well-defined role and drives automation across the system.

---

## Functional Modules

### 1. Equipment Management

Acts as the master data layer for all company assets.

**Key Capabilities**
- Track equipment by:
  - Department
  - Assigned Employee
- Default maintenance responsibility assignment
- Physical location tracking
- Warranty and purchase information
- Logical lifecycle management (Active / Scrapped)

**Key Fields**
- Equipment Name  
- Serial Number  
- Department / Employee Owner  
- Default Maintenance Team  
- Default Technician  
- Purchase Date  
- Warranty Details  
- Physical Location  
- Usability Status  

---

### 2. Maintenance Team Management

Defines specialized operational teams and enforces responsibility boundaries.

**Key Capabilities**
- Create multiple teams (e.g., Mechanics, Electricians, IT Support)
- Assign technicians (users) to teams
- Restrict request assignment visibility to relevant teams only

This ensures that maintenance requests are handled only by qualified personnel.

---

### 3. Maintenance Request Management

Handles the entire lifecycle of a maintenance job.

**Request Types**
- **Corrective** – Unplanned breakdowns  
- **Preventive** – Scheduled routine maintenance  

**Key Fields**
- Subject / Issue Description  
- Equipment  
- Request Type  
- Maintenance Team (auto-filled)  
- Assigned Technician  
- Scheduled Date (Preventive)  
- Duration / Hours Spent  
- Request State  

---

## Business Workflows

### Flow 1: Breakdown (Corrective Maintenance)

1. Any user creates a maintenance request  
2. Selecting equipment automatically:
   - Fetches equipment category  
   - Assigns default maintenance team  
3. Request starts in **New** state  
4. Technician or manager assigns the request  
5. Work begins → state moves to **In Progress**  
6. Technician records actual duration  
7. Request is completed → state moves to **Repaired**

---

### Flow 2: Routine Checkup (Preventive Maintenance)

1. Manager creates a preventive request  
2. Scheduled date is defined  
3. Request appears automatically in **Calendar View**  
4. Technicians can plan work in advance  
5. Execution follows the same lifecycle as corrective requests  

---

## User Interface & Views

### Maintenance Kanban Board

- Grouped by request state:
  - New  
  - In Progress  
  - Repaired  
  - Scrap  
- Drag-and-drop stage transitions  
- Visual indicators:
  - Assigned technician avatar  
  - Overdue requests highlighted  

---

### Calendar View

- Displays preventive maintenance requests only  
- Allows scheduling new requests directly from calendar  
- Improves planning and workload visibility  

---

### Reports (Optional)

- Pivot / Graph views  
- Requests grouped by:
  - Maintenance Team  
  - Equipment Category  

---

## Automation & Smart Features

### Smart Button – Equipment Form

- **Maintenance** button on each equipment record  
- Opens only maintenance requests related to that equipment  
- Displays badge count of open requests  

---

### Scrap Logic

- Moving a request to **Scrap**:
  - Logically marks the equipment as unusable  
  - Preserves historical data  
  - Prevents further operational use  

No records are deleted; all actions remain auditable.

---

## Technical Principles Followed

- Database-first design (Relational Modeling)  
- Modular architecture  
- Minimal third-party dependency usage  
- Clear separation of:
  - Data models  
  - Business logic  
  - UI layers  
- Real-world data flows (no static mocks)  
- Graceful input validation and error handling  
- Team-based Git collaboration  

---

## Evaluation Alignment

This module is designed to align with the following evaluation criteria:

- Logical thinking and problem approach  
- Clean and scalable database design  
- Modular and readable code structure  
- Workflow correctness  
- Usability and UI clarity  
- Performance awareness  
- Team collaboration and ownership  

---

## Team Contribution

All team members actively contributed to:
- System design  
- Business logic  
- Implementation  
- Testing  
- Presentation  

This project reflects shared ownership and collaborative development.

---

## Conclusion

GearGuard is not just a maintenance tracker.  
It is a workflow-centric, ERP-style system designed to demonstrate practical software engineering skills, clean architecture, and real-world problem solving.
