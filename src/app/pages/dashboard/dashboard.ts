import { Component } from '@angular/core';
interface Employee {
  employeeId: number;
  employeeName: string;
  deptId: number;
  deptName: string;
  contactNo: string;
  emailId: string;
  role: string;
}

interface Department {
  deptId: number;
  deptName: string;
  deptHeadName: string | null;
  deptHeadEmpId: number | null;
  createdDate: string;
}

interface Leave {
  id: number;
  employeeId: number;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface Role {
  roleName: string;
  description?: string;
}

@Component({
  imports: [],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})


export class Dashboard {

  today = new Date();

  activeTab = 'overview';

  pageTitle = 'Dashboard';

  showModal = false;
  modalType = '';
  modalTitle = '';
  editId: number | null = null;

  employeeSearch = '';
  leaveSearch = '';
  leaveFilter = 'All';

  menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'employees', label: 'Employees', icon: '👥' },
    { id: 'leaves', label: 'Leave Management', icon: '📅' },
    { id: 'departments', label: 'Departments', icon: '🏢' },
    { id: 'roles', label: 'Roles', icon: '🛡️' }
  ];

  // Employee demo data
  // Replace with your GetEmployees API response.

  employees: Employee[] = [
    {
      employeeId: 1,
      employeeName: 'Aarav Sharma',
      deptId: 1,
      deptName: 'Engineering',
      contactNo: '9000000401',
      emailId: 'leave.demo.aarav@example.invalid',
      role: 'Department Head'
    },
    {
      employeeId: 2,
      employeeName: 'Priya Nair',
      deptId: 1,
      deptName: 'Engineering',
      contactNo: '9000000402',
      emailId: 'leave.demo.priya@example.invalid',
      role: 'Employee'
    },
    {
      employeeId: 3,
      employeeName: 'Meera Rao',
      deptId: 2,
      deptName: 'Human Resources',
      contactNo: '9000000403',
      emailId: 'leave.demo.meera@example.invalid',
      role: 'Department Head'
    },
    {
      employeeId: 4,
      employeeName: 'Kabir Khan',
      deptId: 2,
      deptName: 'Human Resources',
      contactNo: '9000000404',
      emailId: 'leave.demo.kabir@example.invalid',
      role: 'Employee'
    },
    {
      employeeId: 5,
      employeeName: 'Rohan Patil',
      deptId: 3,
      deptName: 'Operations',
      contactNo: '9000000405',
      emailId: 'leave.demo.rohan@example.invalid',
      role: 'Department Head'
    }
  ];

  // Department demo data

  departments: Department[] = [
    {
      deptId: 1,
      deptName: 'Engineering',
      deptHeadName: 'Aarav Sharma',
      deptHeadEmpId: 1,
      createdDate: '2026-10-30T10:34:57'
    },
    {
      deptId: 2,
      deptName: 'Human Resources',
      deptHeadName: 'Meera Rao',
      deptHeadEmpId: 3,
      createdDate: '2026-10-30T10:34:57'
    },
    {
      deptId: 3,
      deptName: 'Operations',
      deptHeadName: 'Rohan Patil',
      deptHeadEmpId: 5,
      createdDate: '2026-10-30T10:34:57'
    },
    {
      deptId: 4,
      deptName: 'Marketing',
      deptHeadName: null,
      deptHeadEmpId: null,
      createdDate: '2026-11-02T12:52:24'
    }
  ];

  // Demo leave records
  // Replace with GetAllLeaves API response.

  leaves: Leave[] = [
    {
      id: 1,
      employeeId: 2,
      leaveType: 'Casual Leave',
      fromDate: '2026-11-12',
      toDate: '2026-11-13',
      reason: 'Personal work',
      status: 'Pending'
    },
    {
      id: 2,
      employeeId: 4,
      leaveType: 'Sick Leave',
      fromDate: '2026-11-14',
      toDate: '2026-11-15',
      reason: 'Not feeling well',
      status: 'Approved'
    },
    {
      id: 3,
      employeeId: 5,
      leaveType: 'Earned Leave',
      fromDate: '2026-11-20',
      toDate: '2026-11-22',
      reason: 'Family function',
      status: 'Rejected'
    }
  ];

  // Replace with GetAllRoles API response.

  roles: Role[] = [
    { roleName: 'HR', description: 'Human Resources administration' },
    { roleName: 'Employee', description: 'Employee access' },
    { roleName: 'Department Head', description: 'Department leave approvals' },
    { roleName: 'Manager', description: 'Manager access' },
    { roleName: 'Admin', description: 'System administration' }
  ];

  employeeForm: any = this.getEmptyEmployee();

  leaveForm: any = this.getEmptyLeave();

  departmentForm: any = this.getEmptyDepartment();

  // Navigation

  changeTab(tab: string): void {
    this.activeTab = tab;

    const titles: any = {
      overview: 'Dashboard',
      employees: 'Employee Management',
      leaves: 'Leave Management',
      departments: 'Department Management',
      roles: 'Role Management'
    };

    this.pageTitle = titles[tab] || 'Dashboard';
  }

  // Search employees

  get filteredEmployees(): Employee[] {
    const search = this.employeeSearch.toLowerCase();

    return this.employees.filter(emp =>
      emp.employeeName.toLowerCase().includes(search) ||
      emp.emailId.toLowerCase().includes(search) ||
      emp.deptName.toLowerCase().includes(search)
    );
  }

  // Search and filter leaves

  get filteredLeaves(): Leave[] {
    const search = this.leaveSearch.toLowerCase();

    return this.leaves.filter(leave => {
      const employeeName =
        this.getEmployeeName(leave.employeeId).toLowerCase();

      const matchesSearch = employeeName.includes(search);

      const matchesStatus =
        this.leaveFilter === 'All' ||
        leave.status === this.leaveFilter;

      return matchesSearch && matchesStatus;
    });
  }

  getLeaveCount(status: string): number {
    return this.leaves.filter(
      leave => leave.status === status
    ).length;
  }

  getEmployeeName(employeeId: number): string {
    return this.employees.find(
      emp => emp.employeeId === employeeId
    )?.employeeName || 'Unknown Employee';
  }

  // Empty forms

  getEmptyEmployee(): any {
    return {
      employeeName: '',
      emailId: '',
      contactNo: '',
      deptId: null,
      role: 'Employee'
    };
  }

  getEmptyLeave(): any {
    return {
      employeeId: null,
      leaveType: 'Casual Leave',
      fromDate: '',
      toDate: '',
      reason: ''
    };
  }

  getEmptyDepartment(): any {
    return {
      deptName: '',
      deptHeadEmpId: null
    };
  }

  // Modal controls

  openModal(type: string, title: string): void {
    this.modalType = type;
    this.modalTitle = title;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editId = null;
  }

  // Employee CRUD

  openEmployeeForm(): void {
    this.editId = null;
    this.employeeForm = this.getEmptyEmployee();

    this.openModal('employee', 'Add New Employee');
  }

  editEmployee(emp: Employee): void {
    this.editId = emp.employeeId;

    this.employeeForm = { ...emp };

    this.openModal('employee', 'Update Employee');
  }

  saveEmployee(): void {

    const department = this.departments.find(
      d => d.deptId === Number(this.employeeForm.deptId)
    );

    if (!department) {
      alert('Please select a valid department.');
      return;
    }

    const employeeData = {
      ...this.employeeForm,
      deptId: Number(this.employeeForm.deptId),
      deptName: department.deptName
    };

    if (this.editId !== null) {

      this.employees = this.employees.map(emp =>
        emp.employeeId === this.editId
          ? { ...emp, ...employeeData }
          : emp
      );

      alert('Employee updated successfully!');

    } else {

      const newEmployee: Employee = {
        ...employeeData,
        employeeId: Math.max(
          0,
          ...this.employees.map(e => e.employeeId)
        ) + 1
      };

      this.employees.push(newEmployee);

      alert('Employee created successfully!');
    }

    this.closeModal();
  }

  deleteEmployee(id: number): void {

    const confirmDelete = confirm(
      'Are you sure you want to delete this employee?'
    );

    if (!confirmDelete) return;

    this.employees = this.employees.filter(
      emp => emp.employeeId !== id
    );

    alert('Employee deleted successfully!');
  }

  // Leave CRUD

  openLeaveForm(): void {
    this.editId = null;
    this.leaveForm = this.getEmptyLeave();

    this.openModal('leave', 'Create Leave');
  }

  editLeave(leave: Leave): void {
    this.editId = leave.id;

    this.leaveForm = { ...leave };

    this.openModal('leave', 'Update Leave');
  }

  saveLeave(): void {

    if (this.leaveForm.toDate < this.leaveForm.fromDate) {
      alert('To date cannot be before from date.');
      return;
    }

    if (!this.employees.some(
      e => e.employeeId === Number(this.leaveForm.employeeId)
    )) {
      alert('Please select a valid employee.');
      return;
    }

    if (this.editId !== null) {

      this.leaves = this.leaves.map(leave =>
        leave.id === this.editId
          ? { ...leave, ...this.leaveForm }
          : leave
      );

      alert('Leave updated successfully!');

    } else {

      const newLeave: Leave = {
        ...this.leaveForm,
        id: Math.max(0, ...this.leaves.map(l => l.id)) + 1,
        employeeId: Number(this.leaveForm.employeeId),
        status: 'Pending'
      };

      this.leaves.push(newLeave);

      alert('Leave created successfully!');
    }

    this.closeModal();
  }

  updateLeaveStatus(
    id: number,
    status: 'Approved' | 'Rejected'
  ): void {

    const message = status === 'Approved'
      ? 'approve this leave'
      : 'reject this leave';

    if (!confirm(`Are you sure you want to ${message}?`)) {
      return;
    }

    this.leaves = this.leaves.map(leave =>
      leave.id === id
        ? { ...leave, status }
        : leave
    );

    alert(`Leave ${status.toLowerCase()} successfully!`);
  }

  deleteLeave(id: number): void {

    if (!confirm('Are you sure you want to delete this leave?')) {
      return;
    }

    this.leaves = this.leaves.filter(
      leave => leave.id !== id
    );

    alert('Leave deleted successfully!');
  }

  // Department CRUD

  openDepartmentForm(): void {
    this.editId = null;
    this.departmentForm = this.getEmptyDepartment();

    this.openModal('department', 'Create Department');
  }

  editDepartment(dept: Department): void {
    this.editId = dept.deptId;

    this.departmentForm = {
      deptName: dept.deptName,
      deptHeadEmpId: dept.deptHeadEmpId
    };

    this.openModal('department', 'Update Department');
  }

  saveDepartment(): void {

    const headId = this.departmentForm.deptHeadEmpId
      ? Number(this.departmentForm.deptHeadEmpId)
      : null;

    const head = this.employees.find(
      emp => emp.employeeId === headId
    );

    const departmentData = {
      deptName: this.departmentForm.deptName,
      deptHeadEmpId: headId,
      deptHeadName: head?.employeeName || null
    };

    if (this.editId !== null) {

      this.departments = this.departments.map(dept =>
        dept.deptId === this.editId
          ? { ...dept, ...departmentData }
          : dept
      );

      alert('Department updated successfully!');

    } else {

      this.departments.push({
        ...departmentData,
        deptId: Math.max(
          0,
          ...this.departments.map(d => d.deptId)
        ) + 1,
        createdDate: new Date().toISOString()
      });

      alert('Department created successfully!');
    }

    this.closeModal();
  }

  deleteDepartment(id: number): void {

    if (!confirm('Are you sure you want to delete this department?')) {
      return;
    }

    if (this.employees.some(emp => emp.deptId === id)) {
      alert('Cannot delete department while employees are assigned.');
      return;
    }

    this.departments = this.departments.filter(
      dept => dept.deptId !== id
    );

    alert('Department deleted successfully!');
  }

  // Roles

  loadRoles(): void {
    // TODO: Call GetAllRoles API here.
    alert('Connect GetAllRoles API to refresh roles.');
  }
}