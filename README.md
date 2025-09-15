# SaaS Notes Application

A multi-tenant notes application with role-based access control.

## Features

- Multi-tenancy with strict data isolation
- JWT-based authentication
- Role-based access (Admin/Member)
- Subscription plans (Free/Pro)
- Note management with CRUD operations

## Test Accounts

All passwords are "password":

- admin@acme.test (Admin - Acme tenant)
- user@acme.test (Member - Acme tenant)  
- admin@globex.test (Admin - Globex tenant)
- user@globex.test (Member - Globex tenant)

## Deployment

Backend and frontend are deployed on Vercel.