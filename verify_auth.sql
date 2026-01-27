SELECT U.id, U.email, U.passwordHash, TM.tenantId, T.slug, TM.role 
FROM User U 
LEFT JOIN TenantMembership TM ON U.id = TM.userId 
LEFT JOIN Tenant T ON TM.tenantId = T.id 
WHERE U.email = 'admin@pitayacode.io';
