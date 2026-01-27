-- Disable FK checks temporarily for easier cleanup if needed, but let's try order first
SET FOREIGN_KEY_CHECKS = 0;

-- Set target tenant ID
SET @target_tenant_id = '1ab455c4-fb2e-47fd-8539-3192be8b409f';

-- 1. Delete E-commerce data
DELETE FROM OrderItem WHERE orderId IN (SELECT id FROM `Order` WHERE tenantId = @target_tenant_id);
DELETE FROM `Order` WHERE tenantId = @target_tenant_id;
DELETE FROM Coupon WHERE tenantId = @target_tenant_id;

-- 2. Delete LMS data
DELETE FROM Review WHERE tenantId = @target_tenant_id;
DELETE FROM Enrollment WHERE studentId IN (SELECT id FROM TenantMembership WHERE tenantId = @target_tenant_id);

-- Cleanup Discussions
DELETE FROM DiscussionPost WHERE authorId IN (SELECT id FROM TenantMembership WHERE tenantId = @target_tenant_id);
DELETE FROM DiscussionTopic WHERE authorId IN (SELECT id FROM TenantMembership WHERE tenantId = @target_tenant_id);

-- Cleanup Courses
DELETE FROM CourseResource WHERE courseId IN (SELECT id FROM Course WHERE tenantId = @target_tenant_id);
DELETE FROM Lesson WHERE courseId IN (SELECT id FROM Course WHERE tenantId = @target_tenant_id);
DELETE FROM Module WHERE tenantId = @target_tenant_id;
DELETE FROM Course WHERE tenantId = @target_tenant_id;

-- 3. Delete Notifications
DELETE FROM Notification WHERE tenantId = @target_tenant_id;

-- 4. Delete Memberships
DELETE FROM TenantMembership WHERE tenantId = @target_tenant_id;

-- 5. Delete Tenant itself
DELETE FROM Tenant WHERE id = @target_tenant_id;

SET FOREIGN_KEY_CHECKS = 1;

-- Update admin password
UPDATE User SET passwordHash='$2b$10$3g7XuyB8XLqjIGm2cBJKueml1WuUEdjp6CjFefEP9JODPe5FugFfS' WHERE email='admin@pitayacode.io';
