UPDATE User SET passwordHash = '$2b$10$H3W.zQIoKgMZ6CG9G5/OM.2DJby6iLdGKMQl2I3kQy2V3ud0KV7EW' WHERE email = 'admin@pitayacode.io';
SELECT email, passwordHash FROM User WHERE email = 'admin@pitayacode.io';
