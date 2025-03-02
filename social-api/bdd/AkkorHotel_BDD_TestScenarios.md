# Akkor Hotel Booking Platform - BDD Test Scenarios

This document outlines comprehensive Behavior-Driven Development (BDD) test scenarios for the Akkor Hotel booking platform. These scenarios follow the Given-When-Then format and describe business behaviors that satisfy user needs.

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Hotel Management](#hotel-management)
4. [Booking Management](#booking-management)
5. [Search and Filtering](#search-and-filtering)
6. [Role-Based Access](#role-based-access)

## Authentication

### Feature: User Registration

```gherkin
Feature: User Registration

Scenario: Successful registration as a new user
  Given a visitor is on the registration page
  When they submit valid registration details including:
    | name      | John Doe             |
    | email     | john.doe@example.com |
    | password  | Password123!         |
    | pseudo    | johndoe              |
  Then they should have a new account created
  And they should be logged into the system
  And they should see a welcome message

Scenario: Attempting registration with an existing email
  Given a visitor is on the registration page
  And a user with email "existing@example.com" already exists in the system
  When they submit registration details with email "existing@example.com"
  Then they should see an error message indicating the email is already taken
  And they should remain on the registration page

Scenario: Attempting registration with invalid data
  Given a visitor is on the registration page
  When they submit registration with invalid details:
    | name      | Jo                   | (too short)
    | email     | invalid-email        | (invalid format)
    | password  | pass                 | (too short)
  Then they should see validation error messages
  And they should remain on the registration page with their data preserved
```

### Feature: User Login

```gherkin
Feature: User Login

Scenario: Successful login
  Given a registered user with email "user@example.com" and password "password123"
  When they submit correct login credentials
  Then they should be successfully logged into the system
  And they should be redirected to their dashboard

Scenario: Failed login with incorrect password
  Given a registered user with email "user@example.com"
  When they submit an incorrect password
  Then they should see an error message indicating invalid credentials
  And they should remain on the login page

Scenario: Failed login with non-existent email
  Given no user exists with email "nonexistent@example.com"
  When they attempt to login with email "nonexistent@example.com"
  Then they should see an error message indicating invalid credentials
  And they should remain on the login page
```

### Feature: User Logout

```gherkin
Feature: User Logout

Scenario: Successful logout
  Given a user is logged into the system
  When they click the logout button
  Then they should be logged out of the system
  And they should be redirected to the home page

Scenario: Attempting to access account after logout
  Given a user has logged out of the system
  When they try to access their account dashboard
  Then they should be redirected to the login page
```

## User Management

### Feature: User Listing

```gherkin
Feature: User Listing

Scenario: Admin views all users
  Given an admin is logged into the system
  When they navigate to the user management section
  Then they should see a list of all users in the system

Scenario: Employee views all users
  Given an employee is logged into the system
  When they navigate to the user management section
  Then they should see a list of all users in the system

Scenario: Regular user attempts to view all users
  Given a regular user is logged into the system
  When they attempt to access the user management section
  Then they should see an access denied message
```

### Feature: User Creation

```gherkin
Feature: User Creation

Scenario: Admin creates a user with admin role
  Given an admin is logged into the system
  When they create a new user with admin privileges
  Then a new admin user should be created in the system

Scenario: Admin creates a user with employee role
  Given an admin is logged into the system
  When they create a new user with employee privileges
  Then a new employee user should be created in the system

Scenario: Employee creates a user with regular role
  Given an employee is logged into the system
  When they create a new user with regular privileges
  Then a new regular user should be created in the system

Scenario: Employee attempts to create a user with admin role
  Given an employee is logged into the system
  When they attempt to create a user with admin privileges
  Then they should see an access denied message
  And no new user should be created

Scenario: Public user registration
  Given a visitor is on the registration page
  When they submit valid registration details
  Then a new user account should be created
  And they should be logged into the system
```

### Feature: Viewing User Details

```gherkin
Feature: Viewing User Details

Scenario: User views their own profile
  Given a user is logged into the system
  When they navigate to their profile page
  Then they should see their complete profile information

Scenario: Admin views another user's profile
  Given an admin is logged into the system
  When they view the profile of another user
  Then they should see that user's complete profile information

Scenario: Employee views another user's profile
  Given an employee is logged into the system
  When they view the profile of another user
  Then they should see that user's complete profile information

Scenario: Regular user attempts to view another user's profile
  Given a regular user is logged into the system
  When they attempt to view another user's profile
  Then they should see an access denied message
```

### Feature: Updating User Details

```gherkin
Feature: Updating User Details

Scenario: User updates their own profile
  Given a user is logged into the system
  When they edit and save their profile information
  Then their profile should be updated with the new information

Scenario: Admin updates another user's profile
  Given an admin is logged into the system
  When they edit and save another user's profile information
  Then that user's profile should be updated with the new information

Scenario: Admin upgrades a user's role
  Given an admin is logged into the system
  When they change a user's role from "user" to "employee"
  Then that user should now have employee privileges in the system

Scenario: Employee attempts to update another user's profile
  Given an employee is logged into the system
  When they attempt to edit another user's profile
  Then they should see an access denied message
  And no changes should be made to that user's profile

Scenario: User attempts to upgrade their role
  Given a regular user is logged into the system
  When they attempt to change their role to "admin"
  Then their role should remain unchanged
```

### Feature: Deleting User Accounts

```gherkin
Feature: Deleting User Accounts

Scenario: User deletes their own account
  Given a user is logged into the system
  When they request to delete their own account
  And they confirm the deletion
  Then their account should be removed from the system
  And they should be logged out

Scenario: Admin deletes another user's account
  Given an admin is logged into the system
  When they delete another user's account
  Then that user's account should be removed from the system

Scenario: Admin attempts to delete the last admin account
  Given there is only one admin user in the system
  And that admin is logged in
  When they attempt to delete their own account
  Then they should see a message indicating they cannot delete the last admin account
  And their account should remain active

Scenario: Employee attempts to delete another user's account
  Given an employee is logged into the system
  When they attempt to delete another user's account
  Then they should see an access denied message
  And the user's account should remain active
```

## Hotel Management

### Feature: Hotel Listing

```gherkin
Feature: Hotel Listing

Scenario: Visitor views all hotels
  Given a visitor is on the hotel listing page
  When they browse the available hotels
  Then they should see a list of all available hotels

Scenario: User filters hotels by location
  Given a user is on the hotel listing page
  When they filter hotels by location "Beach City"
  Then they should see only hotels located in "Beach City"

Scenario: User sorts hotels by price
  Given a user is on the hotel listing page
  When they sort hotels by price from lowest to highest
  Then they should see hotels displayed in order of increasing price

Scenario: Employee views hotels with booking information
  Given an employee is logged into the system
  When they browse the list of hotels
  Then they should see hotels with their booking information
```

### Feature: Viewing Hotel Details

```gherkin
Feature: Viewing Hotel Details

Scenario: Visitor views hotel details
  Given a visitor is on the hotel listing page
  When they select a specific hotel
  Then they should see the full details of that hotel

Scenario: Employee views hotel details with bookings
  Given an employee is logged into the system
  When they view details for a specific hotel
  Then they should see the hotel details including booking information

Scenario: User views non-existent hotel
  Given a user is on the hotel listing page
  When they try to access details for a hotel that doesn't exist
  Then they should see a message indicating the hotel was not found
```

### Feature: Creating Hotels

```gherkin
Feature: Creating Hotels

Scenario: Admin creates a new hotel
  Given an admin is logged into the system
  When they create a new hotel with valid details
  Then the new hotel should appear in the hotel listings

Scenario: Employee attempts to create a hotel
  Given an employee is logged into the system
  When they attempt to create a new hotel
  Then they should see an access denied message
  And no new hotel should be created

Scenario: Admin creates a hotel with invalid data
  Given an admin is logged into the system
  When they submit invalid hotel details
    | name             | "" (empty)          |
    | price_per_night  | -10 (negative)      |
  Then they should see validation error messages
  And no new hotel should be created
```

### Feature: Updating Hotels

```gherkin
Feature: Updating Hotels

Scenario: Admin updates a hotel
  Given an admin is logged into the system
  When they edit and save a hotel's information
  Then the hotel should be updated with the new information

Scenario: Employee attempts to update a hotel
  Given an employee is logged into the system
  When they attempt to edit a hotel
  Then they should see an access denied message
  And no changes should be made to the hotel

Scenario: Admin attempts to update a non-existent hotel
  Given an admin is logged into the system
  When they attempt to update a hotel that doesn't exist
  Then they should see a message indicating the hotel was not found
```

### Feature: Deleting Hotels

```gherkin
Feature: Deleting Hotels

Scenario: Admin deletes a hotel with no bookings
  Given an admin is logged into the system
  And a hotel with no bookings exists
  When they delete that hotel
  Then the hotel should be removed from the system

Scenario: Admin attempts to delete a hotel with bookings
  Given an admin is logged into the system
  And a hotel with existing bookings
  When they attempt to delete that hotel
  Then they should see a message indicating the hotel cannot be deleted while it has bookings
  And the hotel should remain in the system

Scenario: Employee attempts to delete a hotel
  Given an employee is logged into the system
  When they attempt to delete a hotel
  Then they should see an access denied message
  And the hotel should remain in the system
```

## Booking Management

### Feature: Booking Listing

```gherkin
Feature: Booking Listing

Scenario: User views their own bookings
  Given a regular user is logged into the system
  When they navigate to their bookings page
  Then they should see a list of only their own bookings

Scenario: Admin views all bookings
  Given an admin is logged into the system
  When they navigate to the booking management section
  Then they should see bookings from all users

Scenario: Employee views all bookings
  Given an employee is logged into the system
  When they navigate to the booking management section
  Then they should see bookings from all users

Scenario: Admin filters bookings by user email
  Given an admin is logged into the system
  When they filter bookings by user email "user@example.com"
  Then they should see only bookings made by that user

Scenario: User filters their bookings by date
  Given a regular user is logged into the system
  When they filter their bookings between April 1st and April 30th
  Then they should see only their bookings within that date range
```

### Feature: Creating Bookings

```gherkin
Feature: Creating Bookings

Scenario: User makes a successful booking
  Given a user is logged into the system
  When they complete a booking form for an available hotel
  Then a new booking should be created
  And they should receive a booking confirmation

Scenario: User attempts to book with invalid dates
  Given a user is logged into the system
  When they submit a booking with check-out date before check-in date
  Then they should see an error message about invalid dates
  And no booking should be created

Scenario: User attempts to book with too many guests
  Given a user is logged into the system
  When they submit a booking with more guests than the hotel allows
  Then they should see an error message about exceeding guest capacity
  And no booking should be created
```

### Feature: Viewing Booking Details

```gherkin
Feature: Viewing Booking Details

Scenario: User views their own booking
  Given a user is logged into the system
  And they have an existing booking
  When they view that booking's details
  Then they should see all information about their booking

Scenario: Admin views any booking
  Given an admin is logged into the system
  When they view details for any booking
  Then they should see all information about that booking

Scenario: Employee views any booking
  Given an employee is logged into the system
  When they view details for any booking
  Then they should see all information about that booking

Scenario: User attempts to view another user's booking
  Given a regular user is logged into the system
  When they attempt to view another user's booking
  Then they should see an access denied message
```

### Feature: Updating Bookings

```gherkin
Feature: Updating Bookings

Scenario: User updates their own booking
  Given a user is logged into the system
  And they have an existing booking
  When they modify and save their booking details
  Then their booking should be updated with the new information

Scenario: Admin updates any booking
  Given an admin is logged into the system
  When they modify and save any booking's details
  Then that booking should be updated with the new information

Scenario: Employee attempts to update a booking
  Given an employee is logged into the system
  When they attempt to modify a booking
  Then they should see an access denied message
  And no changes should be made to the booking

Scenario: User attempts to update another user's booking
  Given a regular user is logged into the system
  When they attempt to modify another user's booking
  Then they should see an access denied message
  And no changes should be made to the booking
```

### Feature: Cancelling Bookings

```gherkin
Feature: Cancelling Bookings

Scenario: User cancels their booking more than 48 hours before check-in
  Given a user is logged into the system
  And they have a booking with check-in more than 48 hours in the future
  When they cancel their booking
  Then the booking should be marked as cancelled
  And they should receive a cancellation confirmation

Scenario: User attempts to cancel their booking less than 48 hours before check-in
  Given a user is logged into the system
  And they have a booking with check-in less than 48 hours in the future
  When they attempt to cancel the booking
  Then they should see a message indicating cancellation is not possible
  And the booking should remain active

Scenario: Admin cancels any booking regardless of check-in time
  Given an admin is logged into the system
  When they cancel any booking
  Then the booking should be marked as cancelled

Scenario: User attempts to cancel another user's booking
  Given a regular user is logged into the system
  When they attempt to cancel another user's booking
  Then they should see an access denied message
  And the booking should remain active
```

## Search and Filtering

### Feature: Hotel Search

```gherkin
Feature: Hotel Search

Scenario: User searches for hotels by name
  Given a user is on the hotel listing page
  When they search for hotels with the term "Luxury"
  Then they should see hotels with "Luxury" in their name or description

Scenario: User filters hotels by price range
  Given a user is on the hotel listing page
  When they filter hotels between $100 and $300 per night
  Then they should see only hotels with prices in that range

Scenario: User filters hotels by availability
  Given a user is on the hotel listing page
  When they filter to show only available hotels
  Then they should see only hotels that are available for booking

Scenario: User combines search and filters
  Given a user is on the hotel listing page
  When they search for "Beach" with price range $200-$400 and available only
  Then they should see only available hotels with "Beach" in the name and prices in that range
```

### Feature: Booking Search

```gherkin
Feature: Booking Search

Scenario: Admin searches bookings by user information
  Given an admin is logged into the system
  When they search bookings with the term "john@example.com"
  Then they should see bookings associated with that email

Scenario: Admin searches bookings by hotel name
  Given an admin is logged into the system
  When they search bookings with the term "Luxury Beach Resort"
  Then they should see bookings for that hotel

Scenario: Admin filters bookings by date range
  Given an admin is logged into the system
  When they filter bookings between May 1st and May 31st
  Then they should see only bookings with check-in dates in that range

Scenario: Admin filters bookings by status
  Given an admin is logged into the system
  When they filter bookings by status "cancelled"
  Then they should see only cancelled bookings

Scenario: Admin combines search and filters
  Given an admin is logged into the system
  When they search for "john" with status "confirmed" and date range April 1st to April 30th
  Then they should see only confirmed bookings for users matching "john" within that date range
```

## Role-Based Access

### Feature: Role-based Permissions

```gherkin
Feature: Role-based Access Control

Scenario: Admin accessing user management
  Given an admin is logged into the system
  When they navigate to the user management section
  Then they should be able to view and manage all users

Scenario: Employee accessing user management
  Given an employee is logged into the system
  When they navigate to the user management section
  Then they should be able to view all users

Scenario: Regular user attempting to access user management
  Given a regular user is logged into the system
  When they attempt to access the user management section
  Then they should see an access denied message

Scenario: Admin creating a new hotel
  Given an admin is logged into the system
  When they create a new hotel
  Then the hotel should be added to the system

Scenario: Employee attempting to create a hotel
  Given an employee is logged into the system
  When they attempt to create a new hotel
  Then they should see an access denied message

Scenario: Admin updating a hotel
  Given an admin is logged into the system
  When they update a hotel's information
  Then the changes should be saved

Scenario: Employee attempting to update a hotel
  Given an employee is logged into the system
  When they attempt to update a hotel's information
  Then they should see an access denied message

Scenario: User viewing their own profile
  Given a regular user is logged into the system
  When they access their own profile
  Then they should see their profile information

Scenario: User attempting to view another user's profile
  Given a regular user is logged into the system
  When they attempt to view another user's profile
  Then they should see an access denied message
```

### Feature: Account Authentication

```gherkin
Feature: Account Authentication

Scenario: Accessing protected content with valid login
  Given a user is logged into the system
  When they access their booking history
  Then they should see their list of bookings

Scenario: Accessing protected content without login
  Given a user is not logged in
  When they attempt to access their booking history
  Then they should be redirected to the login page

Scenario: Accessing protected content after session expires
  Given a user's login session has expired
  When they attempt to access their booking history
  Then they should be redirected to the login page

Scenario: Accessing public content without login
  Given a user is not logged in
  When they browse the hotel listings
  Then they should see the list of available hotels
``` 
