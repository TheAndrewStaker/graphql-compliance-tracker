Feature: Managing Controls, Owners, and Tasks
  Users can create, edit, and delete Controls, Owners, and Tasks through dedicated
  management pages reachable from a persistent navigation bar.

  Each entity has its own page showing a full data table. Create and Edit open a
  dialog form over the current page. Delete requires explicit confirmation.

  Non-goals:
  - Bulk operations (multi-select delete, bulk status change)
  - Inline editing within the data table
  - Pagination (deferred; all records fetched at once for now)
  - Access control or permissions

  # ── Controls ──────────────────────────────────────────────────────────────

  Rule: A Control requires a non-empty title and category

    Example: Create a Control with valid inputs
      Given the user is on the Controls page
      When they open the Create Control dialog
      And enter title "SOC 2 Access Review" and category "Access Control"
      And submit the form
      Then the new Control appears in the Controls table with status UNKNOWN
      And the dialog closes

    Example: Create a Control with an optional description
      Given the user is on the Controls page
      When they open the Create Control dialog
      And enter a title, category, and description "AES-256 required"
      And submit the form
      Then the new Control appears in the Controls table

    Example: Submit a Create Control form with a blank title is blocked
      Given the user has opened the Create Control dialog
      When they leave the title field empty and submit the form
      Then a validation error is shown on the title field
      And no mutation is sent to the server

    Example: Edit a Control's title, category, description, and status
      Given a Control "Password Policy" exists
      When the user opens the Edit dialog for that Control
      And changes the title to "Password Complexity Policy" and status to PASSING
      And submits the form
      Then the Controls table shows the updated title and status

    Example: Delete a Control that has no Tasks
      Given a Control "Unused Control" exists with no Tasks
      When the user clicks Delete for that Control and confirms
      Then the Control is removed from the table

    Example: Delete a Control that has Tasks cascades to its Tasks
      Given a Control "Active Control" exists with 3 Tasks
      When the user clicks Delete for that Control and confirms
      Then the Control is removed from the Controls table
      And those Tasks no longer appear on the Tasks page

  # ── Owners ────────────────────────────────────────────────────────────────

  Rule: Owner email must be unique

    Example: Create an Owner with valid name and email
      Given the user is on the Owners page
      When they open the Create Owner dialog
      And enter name "Alice Chen" and email "alice@example.com"
      And submit the form
      Then the new Owner appears in the Owners table

    Example: Create an Owner with a duplicate email is rejected
      Given an Owner with email "alice@example.com" already exists
      When the user opens the Create Owner dialog
      And enters the same email and submits the form
      Then a server error is shown in the dialog
      And the Owner is not created

    Example: Edit an Owner's name and email
      Given an Owner "Bob Smith" exists
      When the user opens the Edit dialog for that Owner
      And changes the name to "Robert Smith" and submits
      Then the Owners table shows the updated name

    Example: Delete an Owner who has no Tasks
      Given an Owner "Temp User" exists with no Tasks assigned
      When the user clicks Delete for that Owner and confirms
      Then the Owner is removed from the table

    Example: Delete an Owner who has Tasks is blocked
      Given an Owner "Active User" exists with Tasks assigned to them
      When the user clicks Delete for that Owner and confirms
      Then an error is shown explaining the Owner cannot be deleted while Tasks exist
      And the Owner remains in the table

  # ── Tasks ─────────────────────────────────────────────────────────────────

  Rule: A Task requires a Control, an Owner, and a due date

    Example: Create a Task with all required fields
      Given at least one Control and one Owner exist
      When the user opens the Create Task dialog
      And selects a Control, selects an Owner, and enters a due date
      And submits the form
      Then the new Task appears in the Tasks table

    Example: Submit a Create Task form without an Owner is blocked
      Given the user has opened the Create Task dialog
      When they select a Control and due date but no Owner and submit
      Then a validation error is shown on the Owner field
      And no mutation is sent to the server

    Example: Edit a Task's notes and due date
      Given a Task exists with notes "Review logs"
      When the user opens the Edit dialog for that Task
      And changes the notes to "Review access logs for Q1" and updates the due date
      And submits the form
      Then the Tasks table shows the updated notes and due date

    Example: Delete a Task
      Given a Task exists
      When the user clicks Delete for that Task and confirms
      Then the Task is removed from the Tasks table
      And it no longer appears in the task drawer for its Control

  # ── Navigation ────────────────────────────────────────────────────────────

  Rule: The navigation bar is always visible and reflects the active page

    Example: Navigate to another page
      Given the user is on any page
      When they click "Owners" in the navigation bar
      Then the Owners page is shown and the Owners nav link is marked active

  # ── Forms ─────────────────────────────────────────────────────────────────

  Rule: Forms submit on Enter and dialogs close on Escape

    Example: Submit a form with the keyboard
      Given a Create or Edit dialog is open with valid data
      When the user presses Enter
      Then the form submits

    Example: Dismiss a dialog with Escape
      Given a Create or Edit dialog is open
      When the user presses Escape
      Then the dialog closes without submitting
