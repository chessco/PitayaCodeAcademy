UPDATE User SET passwordHash='$2b$10$3g7XuyB8XLqjIGm2cBJKueml1WuUEdjp6CjFefEP9JODPe5FugFfS' WHERE email='admin@pitayacode.io';
DELETE FROM Tenant WHERE slug='demo';
