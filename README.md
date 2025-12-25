
## Project Name : Resource Managment System

## Technologies Used : Next.js, Prisma, MySQL, JavaScript / TypeScript, TailwindCSS

## You can run by command : npm run dev

## Problem Statement :

Organizations often manage shared resources like classrooms and labs using manual or disconnected systems, which leads to double bookings, poor tracking, and inefficient usage. There is no centralized platform to manage bookings, approvals, facilities, and maintenance. This creates delays, confusion, and lack of transparency. A digital Resource Management System is needed to automate and streamline these processes.

## Project Objectives :

-> To develop a centralized digital system for managing organizational resources efficiently.
-> To simplify and automate the resource booking and approval process.
-> To ensure proper utilization and timely maintenance of resources.
-> To provide transparency through real-time availability, reports, and dashboards.
-> To reduce manual work, paperwork, and booking conflicts.

## Target Users :

-> Students – To book classrooms, labs, or auditoriums for academic activities.
-> Approvers / Managers – To approve or reject booking requests and monitor usage.
-> Maintenance Staff – To receive maintenance alerts and manage resource upkeep.
-> System Administrators – To manage users, resources, buildings, and system settings.

## Functional Requirements :

1> User Management :
-> The system shall allow users to register and log in.
-> The system shall support role-based access (Admin, Approver, Employee, Student).
-> The system shall allow Admin to create, update, and delete users.
-> The system shall store user details securely.

2> Resource Type Management :
-> The system shall allow Admin to add, edit, and delete resource types.
-> The system shall categorize resources based on type (classroom, lab, auditorium).
-> The system shall display resources based on selected resource type.

3> Building Management :
-> The system shall allow Admin to manage building details.
-> The system shall store building name, number, and total floors.
-> The system shall link each resource to a specific building and floor.

4> Resource Management :
-> The system shall allow Admin to add, update, and remove resources.
-> The system shall store resource details such as name, type, building, floor, and description.
-> The system shall display available resources to users.

5> Facilities Management :
-> The system shall allow Admin to add and manage facilities for each resource.
-> The system shall display facilities (AC, projector, sound system) during booking.
-> The system shall allow users to view facility details before booking.

6> Resource Booking :
-> The system shall allow users to request a booking by selecting date and time.
-> The system shall check resource availability before submitting a request.
-> The system shall prevent double bookings.
-> The system shall support approval-based bookings.
-> The system shall notify users upon booking approval or rejection.

7> Approval Workflow : 
-> The system shall forward booking requests to the designated approver.
-> The system shall allow approvers to approve or reject bookings.
-> The system shall record approval status and approver details.

8> Maintenance Management :
-> The system shall allow Admin to schedule maintenance activities.
-> The system shall track maintenance status (pending, completed).
-> The system shall send maintenance alerts after booking approval if configured.
-> The system shall maintain a maintenance history for each resource.

9> Cupboard & Shelf Management :
-> The system shall allow Admin to manage cupboards for resources.
-> The system shall store cupboard details including name and number of shelves.
-> The system shall allow management of individual shelves.
-> The system shall track shelf capacity and descriptions.

10> Reports & Analytics :
-> The system shall generate reports for:
-> Resource-wise bookings
-> Resource type-wise usage
-> Maintenance history
-> Booking approvals and rejections
-> Monthly and yearly usage summaries
-> The system shall allow users to download reports.

11> Dashboard : 
-> The system shall display a dashboard showing:
-> Total resources and bookings
-> Upcoming bookings
-> Pending approvals
-> Maintenance alerts
-> Usage charts


## Non-Functional Requirements : 

1> Security : 
-> User passwords shall be encrypted.
-> The system shall implement role-based authorization.
-> Only authorized users shall access approval and admin features.
-> Sensitive data shall be protected from unauthorized access.

2> Maintainability : 
-> Easy to update, fix bugs, or add new features using Next.js and Prisma.

3> Usability : 
-> User-friendly interface accessible via web browser.

4> Performance : 
-> The system should handle multiple concurrent bookings without delay.

