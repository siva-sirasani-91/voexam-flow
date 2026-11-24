# Security Specification - VoxExam Pro

## Data Invariants
1. A UserProfile must have a valid UID matching the authenticated user.
2. An Exam can only be created by an Admin.
3. An ExamResult must reference a valid Exam and the Student who took it.
4. Students can only read and write their own UserProfile and ExamResults.
5. All users can read Exams.

## The "Dirty Dozen" Payloads (Red Team Test)
1. Attempt to create a UserProfile for another user ID.
2. Attempt to update `role` to 'admin' as a student.
3. Attempt to create an Exam as a student.
4. Attempt to delete an Exam as a student.
5. Attempt to read another student's ExamResult.
6. Attempt to update `score` on an existing ExamResult.
7. Attempt to inject a 2MB string into a Question text field.
8. Attempt to create a UserProfile without a `uid` field.
9. Attempt to create an Exam with a negative `durationMinutes`.
10. Attempt to list all UserProfiles.
11. Attempt to bypass `isOwner` check by spoofing `studentId` in an ExamResult query.
12. Attempt to update an ExamResult after it has been marked as completed (Terminal State).
